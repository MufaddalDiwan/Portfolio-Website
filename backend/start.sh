#!/bin/bash

# Production startup script for Portfolio API
# This script handles the complete startup process for production deployment

set -e  # Exit on any error

echo "🚀 Starting Portfolio API deployment..."

# Check if we're in the correct directory
if [ ! -f "app.py" ]; then
    echo "❌ Error: app.py not found. Please run this script from the backend directory."
    exit 1
fi

# Load environment variables if .env exists
if [ -f ".env" ]; then
    echo "📄 Loading environment variables from .env file..."
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check required environment variables
echo "🔍 Checking required environment variables..."
required_vars=("DATABASE_URL" "SECRET_KEY" "ALLOWED_ORIGIN")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables: ${missing_vars[*]}"
    echo "Please set these variables or create a .env file."
    exit 1
fi

echo "✅ All required environment variables are set"

# Run database migrations
echo "🔄 Running database migrations..."
python -m alembic upgrade head

if [ $? -ne 0 ]; then
    echo "❌ Database migration failed"
    exit 1
fi

echo "✅ Database migrations completed"

# Start the application with Gunicorn
echo "🌟 Starting Gunicorn server..."
exec gunicorn --config gunicorn.conf.py app:app