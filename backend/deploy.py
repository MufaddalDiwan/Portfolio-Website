#!/usr/bin/env python3
"""
Deployment script for portfolio backend.
Handles database migrations and other deployment tasks.
"""

import logging
import os
import subprocess
import sys
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def run_command(command, description):
    """Run a shell command and handle errors."""
    logger.info(f"Running: {description}")
    logger.info(f"Command: {command}")

    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)

        if result.stdout:
            logger.info(f"Output: {result.stdout}")

        logger.info(f"✅ {description} completed successfully")
        return True

    except subprocess.CalledProcessError as e:
        logger.error(f"❌ {description} failed")
        logger.error(f"Error: {e}")
        if e.stdout:
            logger.error(f"Stdout: {e.stdout}")
        if e.stderr:
            logger.error(f"Stderr: {e.stderr}")
        return False


def check_environment():
    """Check that required environment variables are set."""
    required_vars = ["DATABASE_URL", "SECRET_KEY", "ALLOWED_ORIGIN"]

    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)

    if missing_vars:
        logger.error(f"❌ Missing required environment variables: {', '.join(missing_vars)}")
        return False

    logger.info("✅ All required environment variables are set")
    return True


def run_migrations():
    """Run database migrations."""
    logger.info("🔄 Running database migrations...")

    # Check if migrations directory exists
    if not os.path.exists("migrations"):
        logger.error("❌ Migrations directory not found")
        return False

    # Run migrations
    success = run_command("alembic upgrade head", "Database migration")

    if success:
        logger.info("✅ Database migrations completed successfully")

    return success


def health_check():
    """Perform a basic health check."""
    logger.info("🔄 Performing health check...")

    try:
        # Import the app to test basic functionality
        from app import create_app

        app = create_app()

        with app.app_context():
            # Test database connection
            from models import db

            db.engine.execute("SELECT 1")

        logger.info("✅ Health check passed")
        return True

    except Exception as e:
        logger.error(f"❌ Health check failed: {e}")
        return False


def main():
    """Main deployment function."""
    logger.info("🚀 Starting deployment process...")
    logger.info(f"Timestamp: {datetime.utcnow().isoformat()}")

    # Check environment variables
    if not check_environment():
        sys.exit(1)

    # Run database migrations
    if not run_migrations():
        logger.error("❌ Deployment failed during database migration")
        sys.exit(1)

    # Perform health check
    if not health_check():
        logger.error("❌ Deployment failed during health check")
        sys.exit(1)

    logger.info("🎉 Deployment completed successfully!")


if __name__ == "__main__":
    main()
