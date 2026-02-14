"""Abstract base class for stock platform uploaders."""

from abc import ABC, abstractmethod
from typing import Optional

from ..models import ImageAsset, UploadResult, Platform


class StockPlatformUploader(ABC):
    """Abstract base class for stock platform uploaders."""

    @property
    @abstractmethod
    def platform(self) -> Platform:
        ...

    @property
    @abstractmethod
    def platform_name(self) -> str:
        ...

    @abstractmethod
    def validate_credentials(self) -> bool:
        """Check if credentials are valid (attempt connection)."""
        ...

    @abstractmethod
    def upload_image(self, asset: ImageAsset) -> UploadResult:
        """Upload a single image with its metadata."""
        ...

    def upload_batch(self, assets: list[ImageAsset]) -> list[UploadResult]:
        """Upload multiple images. Default: sequential."""
        results = []
        for asset in assets:
            result = self.upload_image(asset)
            results.append(result)
        return results
