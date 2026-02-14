"""
Data models for the stock image upload system.
"""

from dataclasses import dataclass, field
from typing import Optional
from enum import Enum
from datetime import datetime


class Platform(Enum):
    ADOBE_STOCK = "adobe_stock"
    FREEPIK = "freepik"
    DREAMSTIME = "dreamstime"


class UploadStatus(Enum):
    PENDING = "pending"
    UPLOADED = "uploaded"
    FAILED = "failed"
    SKIPPED = "skipped"
    PENDING_MANUAL = "pending_manual"


@dataclass
class StockMetadata:
    """Metadata for a single stock image submission."""
    title: str
    description: str
    keywords: list[str]
    categories: list[str]
    is_ai_generated: bool = True
    ai_tool_name: str = "Google Imagen"
    editorial: bool = False
    mature_content: bool = False

    def to_dict(self) -> dict:
        return {
            "title": self.title,
            "description": self.description,
            "keywords": self.keywords,
            "categories": self.categories,
            "is_ai_generated": self.is_ai_generated,
            "ai_tool_name": self.ai_tool_name,
            "editorial": self.editorial,
            "mature_content": self.mature_content,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "StockMetadata":
        return cls(
            title=data["title"],
            description=data["description"],
            keywords=data["keywords"],
            categories=data["categories"],
            is_ai_generated=data.get("is_ai_generated", True),
            ai_tool_name=data.get("ai_tool_name", "Google Imagen"),
            editorial=data.get("editorial", False),
            mature_content=data.get("mature_content", False),
        )


@dataclass
class ImageAsset:
    """An image file ready for stock upload."""
    file_path: str
    scene_index: int
    original_prompt: str
    scene_role: str
    narration_summary: str
    metadata: Optional[StockMetadata] = None
    file_hash: str = ""


@dataclass
class UploadResult:
    """Result of a single upload attempt."""
    platform: Platform
    image_path: str
    status: UploadStatus
    remote_path: Optional[str] = None
    error_message: Optional[str] = None
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())
