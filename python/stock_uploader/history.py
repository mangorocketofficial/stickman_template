"""
Upload history tracking to prevent duplicate uploads.
Uses a JSON file for persistent storage.
"""

import hashlib
import json
import os
from datetime import datetime
from typing import Optional

from .models import ImageAsset, Platform, UploadResult, UploadStatus


class UploadHistory:
    """JSON-file-backed upload history tracker."""

    def __init__(self, history_file: str):
        self.history_file = history_file
        self._data: dict = {"version": 1, "records": {}}
        self.load()

    def load(self) -> None:
        """Load history from JSON file."""
        if os.path.exists(self.history_file):
            try:
                with open(self.history_file, "r", encoding="utf-8") as f:
                    self._data = json.load(f)
            except (json.JSONDecodeError, IOError):
                print(f"  WARNING: Could not read history file, starting fresh.")
                self._data = {"version": 1, "records": {}}
        else:
            self._data = {"version": 1, "records": {}}

    def save(self) -> None:
        """Persist current history to JSON file."""
        os.makedirs(os.path.dirname(self.history_file) or ".", exist_ok=True)
        with open(self.history_file, "w", encoding="utf-8") as f:
            json.dump(self._data, f, ensure_ascii=False, indent=2)

    def is_uploaded(self, file_hash: str, platform: Platform) -> bool:
        """Check if a file has already been successfully uploaded to a platform."""
        record = self._data["records"].get(file_hash)
        if not record:
            return False
        upload = record.get("uploads", {}).get(platform.value)
        if not upload:
            return False
        return upload.get("status") == UploadStatus.UPLOADED.value

    def record_upload(self, result: UploadResult, asset: ImageAsset) -> None:
        """Record an upload attempt result."""
        file_hash = asset.file_hash
        now = datetime.now().isoformat()

        if file_hash not in self._data["records"]:
            self._data["records"][file_hash] = {
                "file_hash": file_hash,
                "file_name": os.path.basename(asset.file_path),
                "scene_index": asset.scene_index,
                "metadata": asset.metadata.to_dict() if asset.metadata else {},
                "uploads": {},
                "created_at": now,
                "updated_at": now,
            }

        record = self._data["records"][file_hash]
        record["uploads"][result.platform.value] = {
            "status": result.status.value,
            "remote_path": result.remote_path,
            "error": result.error_message,
            "timestamp": result.timestamp,
        }
        record["updated_at"] = now
        self.save()

    def get_summary(self) -> dict:
        """Return summary statistics of upload history."""
        records = self._data["records"]
        total = len(records)
        by_platform: dict[str, dict[str, int]] = {}

        for record in records.values():
            for platform_name, upload_info in record.get("uploads", {}).items():
                if platform_name not in by_platform:
                    by_platform[platform_name] = {}
                status = upload_info.get("status", "unknown")
                by_platform[platform_name][status] = (
                    by_platform[platform_name].get(status, 0) + 1
                )

        return {"total_images": total, "by_platform": by_platform}

    @staticmethod
    def compute_file_hash(file_path: str) -> str:
        """Compute SHA-256 hash of a file."""
        sha256 = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(8192), b""):
                sha256.update(chunk)
        return sha256.hexdigest()
