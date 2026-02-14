"""
Configuration and credentials management for stock upload.
Loads settings from .env file.
"""

import os
from dataclasses import dataclass
from typing import Optional
from pathlib import Path


@dataclass
class AdobeStockConfig:
    sftp_host: str
    sftp_port: int
    sftp_username: str
    sftp_password: str
    remote_dir: str = "/"


@dataclass
class FreepikConfig:
    ftp_host: str
    ftp_username: str
    ftp_password: str
    ftp_port: int = 21
    remote_dir: str = "/"
    api_key: Optional[str] = None


@dataclass
class DreamstimeConfig:
    ftp_host: str
    ftp_username: str
    ftp_password: str
    ftp_port: int = 21
    remote_dir: str = "/"


@dataclass
class StockUploaderConfig:
    adobe_stock: Optional[AdobeStockConfig]
    freepik: Optional[FreepikConfig]
    dreamstime: Optional[DreamstimeConfig]
    groq_api_key: str
    history_file: str
    enabled_platforms: list[str]
    dry_run: bool = False


def load_config(env_path: Optional[str] = None) -> StockUploaderConfig:
    """Load configuration from .env and environment variables."""
    if env_path:
        _load_dotenv(env_path)
    else:
        # Try standard locations
        for candidate in [
            Path(__file__).parent.parent.parent / ".env",
            Path.cwd() / ".env",
        ]:
            if candidate.exists():
                _load_dotenv(str(candidate))
                break

    adobe_stock = _load_adobe_config()
    freepik = _load_freepik_config()
    dreamstime = _load_dreamstime_config()

    # Auto-detect enabled platforms from available credentials
    enabled = os.environ.get("STOCK_UPLOAD_ENABLED_PLATFORMS", "")
    if enabled:
        enabled_platforms = [p.strip() for p in enabled.split(",") if p.strip()]
    else:
        enabled_platforms = get_configured_platforms(adobe_stock, freepik, dreamstime)

    default_history = str(
        Path(__file__).parent / "upload_history.json"
    )
    history_file = os.environ.get("STOCK_UPLOAD_HISTORY_FILE", default_history)

    return StockUploaderConfig(
        adobe_stock=adobe_stock,
        freepik=freepik,
        dreamstime=dreamstime,
        groq_api_key=os.environ.get("GROQ_API_KEY", ""),
        history_file=history_file,
        enabled_platforms=enabled_platforms,
    )


def get_configured_platforms(
    adobe: Optional[AdobeStockConfig],
    freepik: Optional[FreepikConfig],
    dreamstime: Optional[DreamstimeConfig],
) -> list[str]:
    """Return list of platforms that have valid credentials."""
    platforms = []
    if adobe:
        platforms.append("adobe_stock")
    if freepik:
        platforms.append("freepik")
    if dreamstime:
        platforms.append("dreamstime")
    return platforms


def _load_dotenv(path: str) -> None:
    try:
        from dotenv import load_dotenv
        load_dotenv(path)
    except ImportError:
        pass


def _load_adobe_config() -> Optional[AdobeStockConfig]:
    host = os.environ.get("ADOBE_STOCK_SFTP_HOST")
    user = os.environ.get("ADOBE_STOCK_SFTP_USER")
    password = os.environ.get("ADOBE_STOCK_SFTP_PASS")
    if not (host and user and password):
        return None
    return AdobeStockConfig(
        sftp_host=host,
        sftp_port=int(os.environ.get("ADOBE_STOCK_SFTP_PORT", "22")),
        sftp_username=user,
        sftp_password=password,
        remote_dir=os.environ.get("ADOBE_STOCK_REMOTE_DIR", "/"),
    )


def _load_freepik_config() -> Optional[FreepikConfig]:
    host = os.environ.get("FREEPIK_FTP_HOST")
    user = os.environ.get("FREEPIK_FTP_USER")
    password = os.environ.get("FREEPIK_FTP_PASS")
    if not (host and user and password):
        return None
    return FreepikConfig(
        ftp_host=host,
        ftp_username=user,
        ftp_password=password,
        ftp_port=int(os.environ.get("FREEPIK_FTP_PORT", "21")),
        remote_dir=os.environ.get("FREEPIK_REMOTE_DIR", "/"),
        api_key=os.environ.get("FREEPIK_API_KEY"),
    )


def _load_dreamstime_config() -> Optional[DreamstimeConfig]:
    host = os.environ.get("DREAMSTIME_FTP_HOST", "ftp.dreamstime.com")
    user = os.environ.get("DREAMSTIME_FTP_USER")
    password = os.environ.get("DREAMSTIME_FTP_PASS")
    if not (user and password):
        return None
    return DreamstimeConfig(
        ftp_host=host,
        ftp_username=user,
        ftp_password=password,
        ftp_port=int(os.environ.get("DREAMSTIME_FTP_PORT", "21")),
        remote_dir=os.environ.get("DREAMSTIME_REMOTE_DIR", "/"),
    )
