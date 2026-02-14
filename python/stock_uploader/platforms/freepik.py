"""
Freepik contributor upload via FTP.

FTP upload requires 500+ published files on the platform.
For the initial phase, generates a local upload package for manual web upload.
"""

import csv
import os
import shutil
import time
from ftplib import FTP
from typing import Optional

from ..models import ImageAsset, UploadResult, Platform, UploadStatus
from ..config import FreepikConfig
from .base import StockPlatformUploader


class FreepikUploader(StockPlatformUploader):
    """Freepik contributor upload via FTP or local package generation."""

    def __init__(self, config: FreepikConfig):
        self.config = config
        self._ftp: Optional[FTP] = None
        self._ftp_available: Optional[bool] = None

    @property
    def platform(self) -> Platform:
        return Platform.FREEPIK

    @property
    def platform_name(self) -> str:
        return "Freepik"

    def validate_credentials(self) -> bool:
        """Attempt FTP connection. Returns False if FTP not yet available."""
        try:
            self._connect()
            self._disconnect()
            self._ftp_available = True
            return True
        except Exception:
            self._ftp_available = False
            return False

    def _connect(self) -> None:
        """Establish FTP connection in passive mode."""
        self._ftp = FTP()
        self._ftp.connect(self.config.ftp_host, self.config.ftp_port, timeout=30)
        self._ftp.login(self.config.ftp_username, self.config.ftp_password)
        self._ftp.set_pasv(True)

    def _disconnect(self) -> None:
        """Close FTP connection."""
        if self._ftp:
            try:
                self._ftp.quit()
            except Exception:
                self._ftp.close()
            self._ftp = None

    def upload_image(self, asset: ImageAsset) -> UploadResult:
        """Upload a single image via FTP."""
        filename = os.path.basename(asset.file_path)
        remote_path = f"{self.config.remote_dir.rstrip('/')}/{filename}"

        for attempt in range(3):
            try:
                if not self._ftp:
                    self._connect()
                with open(asset.file_path, "rb") as f:
                    self._ftp.storbinary(f"STOR {remote_path}", f)
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
        """Upload images via FTP if available, otherwise prepare local package."""
        # Check if FTP is available
        if self._ftp_available is None:
            self.validate_credentials()

        if self._ftp_available:
            return self._upload_batch_ftp(assets)
        else:
            return self._prepare_local_package(assets)

    def _upload_batch_ftp(self, assets: list[ImageAsset]) -> list[UploadResult]:
        """Upload all images via FTP."""
        results = []
        try:
            self._connect()
            for asset in assets:
                result = self.upload_image(asset)
                results.append(result)
        except Exception as e:
            print(f"    Freepik FTP batch error: {e}")
        finally:
            self._disconnect()
        return results

    def _prepare_local_package(self, assets: list[ImageAsset]) -> list[UploadResult]:
        """
        Prepare a local directory with images + metadata for manual web upload.
        Returns results with PENDING_MANUAL status.
        """
        package_dir = os.path.join(
            os.path.dirname(assets[0].file_path) if assets else ".",
            "..", "freepik_upload_package",
        )
        package_dir = os.path.normpath(package_dir)
        os.makedirs(package_dir, exist_ok=True)

        results = []

        # Copy images
        for asset in assets:
            filename = os.path.basename(asset.file_path)
            dest = os.path.join(package_dir, filename)
            shutil.copy2(asset.file_path, dest)
            results.append(UploadResult(
                platform=self.platform,
                image_path=asset.file_path,
                status=UploadStatus.PENDING_MANUAL,
                remote_path=dest,
            ))

        # Generate metadata CSV for reference during web upload
        csv_path = os.path.join(package_dir, "freepik_metadata.csv")
        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["Filename", "Title", "Description", "Keywords", "AI Generated"])
            for asset in assets:
                if not asset.metadata:
                    continue
                m = asset.metadata
                writer.writerow([
                    os.path.basename(asset.file_path),
                    m.title,
                    m.description,
                    ", ".join(m.keywords[:50]),
                    "yes" if m.is_ai_generated else "no",
                ])

        print(f"    FTP not available (need 500+ published files)")
        print(f"    Local upload package created: {package_dir}")
        print(f"    Upload manually at: https://contributor.freepik.com")

        return results
