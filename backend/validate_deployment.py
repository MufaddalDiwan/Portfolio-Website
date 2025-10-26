#!/usr/bin/env python3
"""
Validation script to check deployment configuration.
Run this before deploying to catch common issues.
"""

import os
import sys


def check_file_exists(filepath, description):
    """Check if a file exists."""
    if os.path.exists(filepath):
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description} missing: {filepath}")
        return False


def check_import(module_name, description):
    """Check if a module can be imported."""
    try:
        __import__(module_name)
        print(f"✅ {description} available")
        return True
    except ImportError:
        print(f"❌ {description} not available: {module_name}")
        return False


def check_requirements():
    """Check if requirements.txt has all necessary dependencies."""
    if not os.path.exists("requirements.txt"):
        print("❌ requirements.txt not found")
        return False

    with open("requirements.txt") as f:
        content = f.read()

    required_packages = ["Flask", "gunicorn", "SQLAlchemy", "Alembic", "psycopg2-binary"]

    missing = []
    for package in required_packages:
        if package.lower() not in content.lower():
            missing.append(package)

    if missing:
        print(f"❌ Missing packages in requirements.txt: {', '.join(missing)}")
        return False
    else:
        print("✅ All required packages found in requirements.txt")
        return True


def main():
    """Main validation function."""
    print("🔍 Validating deployment configuration...\n")

    checks = []

    # Check required files
    checks.append(check_file_exists("Procfile", "Procfile"))
    checks.append(check_file_exists("gunicorn.conf.py", "Gunicorn configuration"))
    checks.append(check_file_exists("requirements.txt", "Requirements file"))
    checks.append(check_file_exists("app.py", "Main application"))
    checks.append(check_file_exists("deploy.py", "Deployment script"))
    checks.append(check_file_exists("DEPLOYMENT.md", "Deployment documentation"))
    checks.append(check_file_exists(".env.example", "Environment example"))

    # Check Python imports
    checks.append(check_import("flask", "Flask"))
    checks.append(check_import("gunicorn", "Gunicorn"))
    checks.append(check_import("sqlalchemy", "SQLAlchemy"))
    checks.append(check_import("alembic", "Alembic"))

    # Check requirements.txt content
    checks.append(check_requirements())

    # Summary
    passed = sum(checks)
    total = len(checks)

    print(f"\n📊 Validation Summary: {passed}/{total} checks passed")

    if passed == total:
        print("🎉 All deployment configuration checks passed!")
        print("✅ Ready for deployment")
        return 0
    else:
        print("❌ Some checks failed. Please fix the issues before deploying.")
        return 1


if __name__ == "__main__":
    # Change to backend directory if not already there
    if os.path.basename(os.getcwd()) != "backend" and os.path.exists("backend"):
        os.chdir("backend")

    sys.exit(main())
