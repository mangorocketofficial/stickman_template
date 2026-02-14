"""
Dreamstime contributor upload via FTP.

Embeds IPTC-like metadata into PNG files using Pillow PngInfo,
then uploads via FTP. Dreamstime reads metadata from uploaded files.
"""

import os
import tempfile
import time
from ftplib import FTP
from typing import Optional

from ..models import ImageAsset, UploadResult, Platform, UploadStatus
from ..config import DreamstimeConfig
from .base import StockPlatformUploader


class DreamstimeUploader(StockPlatformUploader):
    """Dreamstime contributor upload via FTP with embedded metadata."""

    def __init__(self, config: DreamstimeConfig):
        self.config = config
        self._ftp: Optional[FTP] = None

    @property
    def platform(self) -> Platform:
        return Platform.DREAMSTIME

    @property
    def platform_name(self) -> str:
        return "Dreamstime"

    def validate_credentials(self) -> bool:
        """Attempt FTP connection to validate credentials."""
        try:
            self._connect()
            self._disconnect()
            return True
        except Exception as e:
            print(f"    Dreamstime credential validation failed: {e}")
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
        """
        Upload image with embedded metadata via FTP.
        1. Create temp copy with metadata embedded in PNG tEXt chunks
        2. Upload via FTP
        3. Clean up temp file
        """
        filename = os.path.basename(asset.file_path)
        remote_path = f"{self.config.remote_dir.rstrip('/')}/{filename}"

        # Create temp file with metadata
        temp_path = None
        try:
            temp_path = self._embed_metadata(asset)
            upload_path = temp_path or asset.file_path
        except Exception as e:
            print(f"    Metadata embedding failed, uploading without: {e}")
            upload_path = asset.file_path

        for attempt in range(3):
            try:
                if not self._ftp:
                    self._connect()
                with open(upload_path, "rb") as f:
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
            finally:
                if temp_path and os.path.exists(temp_path):
                    os.unlink(temp_path)

    def upload_batch(self, assets: list[ImageAsset]) -> list[UploadResult]:
        """Upload all images via FTP with one connection."""
        results = []
        try:
            self._connect()
            for asset in assets:
                result = self.upload_image(asset)
                results.append(result)
        except Exception as e:
            print(f"    Dreamstime batch error: {e}")
        finally:
            self._disconnect()
        return results

    def _embed_metadata(self, asset: ImageAsset) -> Optional[str]:
        """
        Embed metadata into a copy of the PNG using Pillow PngInfo.
        Returns path to the temp file, or None if embedding fails.
        """
        if not asset.metadata:
            return None

        from PIL import Image
        from PIL.PngImagePlugin import PngInfo

        m = asset.metadata
        metadata = PngInfo()
        metadata.add_text("Title", m.title)
        metadata.add_text("Description", m.description)
        metadata.add_text("Keywords", ", ".join(m.keywords))
        metadata.add_text("Author", "AI Generated - Google Imagen")

        img = Image.open(asset.file_path)

        fd, temp_path = tempfile.mkstemp(suffix=".png")
        os.close(fd)
        img.save(temp_path, pnginfo=metadata)

        return temp_path
