"""
Standalone CLI for stock image upload.

Usage:
    python -m stock_uploader <images_dir> [options]
    python -m stock_uploader remotion/public --dry-run
    python -m stock_uploader remotion/public --platforms adobe_stock,freepik
    python -m stock_uploader remotion/public --force
"""

import argparse
import os
import sys
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(
        description="Upload AI-generated images to stock photography platforms"
    )
    parser.add_argument(
        "images_dir",
        help="Directory containing images (or parent with images/ subdirectory)",
    )
    parser.add_argument(
        "--prompts-log",
        help="Path to prompts_log.json (auto-detected if omitted)",
    )
    parser.add_argument(
        "--platforms", "-p",
        help="Comma-separated platforms: adobe_stock,freepik,dreamstime (default: all configured)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Generate metadata and show plan without uploading",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Force re-upload even if already uploaded",
    )
    parser.add_argument(
        "--env-file",
        help="Path to .env file (default: project root .env)",
    )
    args = parser.parse_args()

    # Resolve images directory
    images_dir = os.path.abspath(args.images_dir)

    # If pointed to a parent dir with images/ subdirectory, use that
    if os.path.isdir(os.path.join(images_dir, "images")):
        actual_images_dir = os.path.join(images_dir, "images")
    else:
        actual_images_dir = images_dir

    if not os.path.isdir(actual_images_dir):
        print(f"Error: Directory not found: {actual_images_dir}")
        sys.exit(1)

    # Load config
    from .config import load_config
    config = load_config(args.env_file)

    if args.dry_run:
        config.dry_run = True

    if args.platforms:
        config.enabled_platforms = [p.strip() for p in args.platforms.split(",")]

    # Run orchestrator
    from .orchestrator import StockUploadOrchestrator
    orchestrator = StockUploadOrchestrator(config)

    result = orchestrator.run(
        images_dir=actual_images_dir,
        prompts_log_path=args.prompts_log,
        force_reupload=args.force,
    )

    # Exit code based on result
    if result.get("status") == "completed":
        sys.exit(0)
    elif result.get("status") == "dry_run":
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
