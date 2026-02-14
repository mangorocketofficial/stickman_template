"""
Adobe Stock contributor upload via SFTP.

Uploads images and a CSV metadata sidecar file.
AI content is tagged with ai_generated=yes in the CSV.
"""

import csv
import io
import os
import time
from typing import Optional

from ..models import ImageAsset, UploadResult, Platform, UploadStatus
from ..config import AdobeStockConfig
from .base import StockPlatformUploader

# Adobe Stock category codes
CATEGORY_MAP = {
    "education": 6,
    "illustration": 1,
    "illustrations": 1,
    "infographic": 6,
    "science": 20,
    "technology": 5,
    "business": 2,
    "health": 12,
    "backgrounds": 17,
    "art": 1,
    "design": 1,
    "people": 3,
    "nature": 16,
}


class AdobeStockUploader(StockPlatformUploader):
    """Adobe Stock contributor upload via SFTP."""

    def __init__(self, config: AdobeStockConfig):
        self.config = config
        self._sftp = None
        self._transport = None

    @property
    def platform(self) -> Platform:
        return Platform.ADOBE_STOCK

    @property
    def platform_name(self) -> str:
        return "Adobe Stock"

    def validate_credentials(self) -> bool:
        """Attempt SFTP connection to validate credentials."""
        try:
            self._connect()
            self._disconnect()
            return True
        except Exception as e:
            print(f"    Adobe Stock credential validation failed: {e}")
            return False

    def _connect(self) -> None:
        """Establish SFTP connection."""
        import paramiko
        self._transport = paramiko.Transport((
            self.config.sftp_host,
            self.config.sftp_port,
        ))
        self._transport.connect(
            username=self.config.sftp_username,
            password=self.config.sftp_password,
        )
        self._sftp = paramiko.SFTPClient.from_transport(self._transport)

    def _disconnect(self) -> None:
        """Close SFTP connection."""
        if self._sftp:
            self._sftp.close()
            self._sftp = None
        if self._transport:
            self._transport.close()
            self._transport = None

    def upload_image(self, asset: ImageAsset) -> UploadResult:
        """Upload a single image via SFTP."""
        filename = os.path.basename(asset.file_path)
        remote_path = f"{self.config.remote_dir.rstrip('/')}/{filename}"

        for attempt in range(3):
            try:
                if not self._sftp:
                    self._connect()
                self._sftp.put(asset.file_path, remote_path)
                return UploadResult(
                    platform=self.platform,
                    image_path=asset.file_path,
                    status=UploadStatus.UPLOADED,
                    remote_path=remote_path,
                )
            except Exception as e:
                self._disconnect()
                if attempt < 2:
                    wait = 2 ** attempt
                    print(f"    Retry {attempt + 1}/3 in {wait}s: {str(e)[:80]}")
                    time.sleep(wait)
                else:
                    return UploadResult(
                        platform=self.platform,
                        image_path=asset.file_path,
                        status=UploadStatus.FAILED,
                        error_message=f"Failed after 3 attempts: {str(e)[:150]}",
                    )

    def upload_batch(self, assets: list[ImageAsset]) -> list[UploadResult]:
        """Upload all images then upload CSV metadata sidecar."""
        results = []
        try:
            self._connect()

            for asset in assets:
                result = self.upload_image(asset)
                results.append(result)

            # Upload CSV sidecar for successfully uploaded images
            uploaded = [
                a for a, r in zip(assets, results)
                if r.status == UploadStatus.UPLOADED
            ]
            if uploaded:
                self._upload_csv_sidecar(uploaded)

        except Exception as e:
            print(f"    Adobe Stock batch error: {e}")
        finally:
            self._disconnect()

        return results

    def _upload_csv_sidecar(self, assets: list[ImageAsset]) -> None:
        """Upload batch CSV metadata file."""
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "Filename", "Title", "Keywords", "Category", "Releases", "AI Generated",
        ])

        for asset in assets:
            if not asset.metadata:
                continue
            m = asset.metadata
            category_code = _map_category(m.categories)
            writer.writerow([
                os.path.basename(asset.file_path),
                m.title,
                ",".join(m.keywords[:50]),
                category_code,
                "",
                "yes" if m.is_ai_generated else "no",
            ])

        csv_content = output.getvalue().encode("utf-8")
        remote_path = f"{self.config.remote_dir.rstrip('/')}/metadata.csv"

        csv_file = io.BytesIO(csv_content)
        self._sftp.putfo(csv_file, remote_path)
        print(f"    Uploaded metadata CSV ({len(assets)} entries)")


def _map_category(categories: list[str]) -> int:
    """Map category names to Adobe Stock numeric codes."""
    for cat in categories:
        code = CATEGORY_MAP.get(cat.lower())
        if code:
            return code
    return 1  # default: illustrations
