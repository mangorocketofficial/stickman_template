"""
Main orchestrator for the stock upload pipeline.
Coordinates scanning, metadata generation, and uploads across platforms.
"""

from typing import Optional

from .config import StockUploaderConfig
from .models import ImageAsset, Platform, UploadResult, UploadStatus
from .scanner import scan_images_directory
from .metadata_generator import generate_metadata_batch
from .history import UploadHistory
from .platforms.base import StockPlatformUploader
from .platforms.adobe_stock import AdobeStockUploader
from .platforms.freepik import FreepikUploader
from .platforms.dreamstime import DreamstimeUploader


class StockUploadOrchestrator:
    """
    Main orchestrator for the stock upload pipeline.

    Flow:
    1. Scan images directory for uploadable images
    2. Check upload history, filter already-uploaded
    3. Generate metadata for new images (LLM batch)
    4. Upload to each enabled platform
    5. Record results in upload history
    6. Print summary report
    """

    def __init__(self, config: StockUploaderConfig):
        self.config = config
        self.history = UploadHistory(config.history_file)
        self._uploaders: dict[str, StockPlatformUploader] = {}
        self._init_uploaders()

    def _init_uploaders(self) -> None:
        """Initialize uploader instances for configured platforms."""
        if "adobe_stock" in self.config.enabled_platforms and self.config.adobe_stock:
            self._uploaders["adobe_stock"] = AdobeStockUploader(self.config.adobe_stock)
        if "freepik" in self.config.enabled_platforms and self.config.freepik:
            self._uploaders["freepik"] = FreepikUploader(self.config.freepik)
        if "dreamstime" in self.config.enabled_platforms and self.config.dreamstime:
            self._uploaders["dreamstime"] = DreamstimeUploader(self.config.dreamstime)

    def run(
        self,
        images_dir: str,
        prompts_log_path: Optional[str] = None,
        platforms: Optional[list[str]] = None,
        force_reupload: bool = False,
    ) -> dict:
        """
        Execute the full upload pipeline.

        Args:
            images_dir: Directory containing scene_XX.png files
            prompts_log_path: Path to prompts_log.json
            platforms: Specific platforms to upload to (None = all enabled)
            force_reupload: Ignore upload history, re-upload everything

        Returns:
            Summary dict with counts per platform
        """
        print("\n" + "=" * 50)
        print("Stock Image Upload Pipeline")
        print("=" * 50)

        # Warn about Shutterstock
        print("\n  NOTE: Shutterstock excluded (AI-generated content prohibited)")

        # Check enabled uploaders
        active_uploaders = self._get_active_uploaders(platforms)
        if not active_uploaders and not self.config.dry_run:
            print("\n  No platforms configured. Set credentials in .env file.")
            print("  Supported: ADOBE_STOCK_SFTP_*, FREEPIK_FTP_*, DREAMSTIME_FTP_*")
            return {"status": "no_platforms"}

        if active_uploaders:
            print(f"\n  Enabled platforms: {', '.join(u.platform_name for u in active_uploaders)}")
        else:
            print("\n  No platforms configured (dry-run: metadata only)")

        # Step 1: Scan images
        print(f"\n[1/4] Scanning images...")
        assets = scan_images_directory(images_dir, prompts_log_path)
        if not assets:
            print("  No uploadable images found.")
            return {"status": "no_images"}
        print(f"  Found {len(assets)} images")

        # Step 2: Generate metadata
        print(f"\n[2/4] Generating metadata (LLM)...")
        metadata_list = generate_metadata_batch(assets, self.config.groq_api_key)
        for asset, metadata in zip(assets, metadata_list):
            asset.metadata = metadata
        print(f"  Generated metadata for {len(metadata_list)} images")

        if self.config.dry_run:
            self._print_dry_run(assets)
            return {"status": "dry_run", "images": len(assets)}

        # Step 3: Upload to each platform
        all_results: dict[str, list[UploadResult]] = {}

        for uploader in active_uploaders:
            platform = uploader.platform
            platform_name = uploader.platform_name
            print(f"\n[3/4] Uploading to {platform_name}...")

            # Filter pending assets
            pending = self._filter_pending_assets(assets, platform, force_reupload)
            if not pending:
                print(f"  All images already uploaded to {platform_name}")
                all_results[platform.value] = []
                continue

            print(f"  Uploading {len(pending)} images...")
            results = uploader.upload_batch(pending)
            all_results[platform.value] = results

            # Record results
            for asset, result in zip(pending, results):
                self.history.record_upload(result, asset)

        # Step 4: Summary
        print(f"\n[4/4] Upload summary")
        self._print_summary(all_results)

        return {
            "status": "completed",
            "images": len(assets),
            "results": {
                k: {
                    "uploaded": sum(1 for r in v if r.status == UploadStatus.UPLOADED),
                    "failed": sum(1 for r in v if r.status == UploadStatus.FAILED),
                    "manual": sum(1 for r in v if r.status == UploadStatus.PENDING_MANUAL),
                }
                for k, v in all_results.items()
            },
        }

    def _get_active_uploaders(
        self, platforms: Optional[list[str]] = None
    ) -> list[StockPlatformUploader]:
        """Get list of active uploaders, optionally filtered."""
        if platforms:
            return [
                u for name, u in self._uploaders.items()
                if name in platforms
            ]
        return list(self._uploaders.values())

    def _filter_pending_assets(
        self,
        assets: list[ImageAsset],
        platform: Platform,
        force: bool = False,
    ) -> list[ImageAsset]:
        """Filter assets that need uploading to a specific platform."""
        if force:
            return assets
        return [
            a for a in assets
            if not self.history.is_uploaded(a.file_hash, platform)
        ]

    def _print_dry_run(self, assets: list[ImageAsset]) -> None:
        """Print what would be uploaded (dry run mode)."""
        print("\n" + "=" * 50)
        print("DRY RUN - No uploads performed")
        print("=" * 50)
        for asset in assets:
            m = asset.metadata
            if not m:
                continue
            print(f"\n  Scene {asset.scene_index}: {m.title}")
            print(f"    Description: {m.description[:80]}...")
            print(f"    Keywords ({len(m.keywords)}): {', '.join(m.keywords[:10])}...")
            print(f"    Categories: {', '.join(m.categories)}")

    def _print_summary(self, results: dict[str, list[UploadResult]]) -> None:
        """Print formatted upload summary report."""
        print("\n" + "-" * 40)
        for platform_name, platform_results in results.items():
            if not platform_results:
                print(f"  {platform_name}: all up to date")
                continue

            uploaded = sum(1 for r in platform_results if r.status == UploadStatus.UPLOADED)
            failed = sum(1 for r in platform_results if r.status == UploadStatus.FAILED)
            manual = sum(1 for r in platform_results if r.status == UploadStatus.PENDING_MANUAL)

            parts = []
            if uploaded:
                parts.append(f"{uploaded} uploaded")
            if failed:
                parts.append(f"{failed} failed")
            if manual:
                parts.append(f"{manual} pending manual")

            print(f"  {platform_name}: {', '.join(parts)}")

            # Show failed details
            for r in platform_results:
                if r.status == UploadStatus.FAILED:
                    print(f"    FAILED: {r.error_message}")
        print("-" * 40)

        # Overall history summary
        summary = self.history.get_summary()
        print(f"  Total tracked images: {summary['total_images']}")
