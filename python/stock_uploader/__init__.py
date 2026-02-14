"""
Stock Image Upload Automation Module

Upload AI-generated images to stock photography platforms.
Supports: Adobe Stock (SFTP), Freepik (FTP), Dreamstime (FTP).

Usage:
    # As module
    from stock_uploader import StockUploadOrchestrator, load_config
    config = load_config()
    orchestrator = StockUploadOrchestrator(config)
    orchestrator.run("path/to/images")

    # As CLI
    python -m stock_uploader path/to/images
"""

from .orchestrator import StockUploadOrchestrator
from .config import load_config, StockUploaderConfig
from .models import Platform, ImageAsset, StockMetadata, UploadResult

__all__ = [
    "StockUploadOrchestrator",
    "load_config",
    "StockUploaderConfig",
    "Platform",
    "ImageAsset",
    "StockMetadata",
    "UploadResult",
]
