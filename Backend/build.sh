#!/bin/bash
# Build script for EcoVision backend deployment

echo "🚀 Starting EcoVision backend build..."

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Create staticfiles directory if it doesn't exist
echo "📁 Setting up static files..."
mkdir -p staticfiles

# Collect static files
echo "🔧 Collecting static files..."
python manage.py collectstatic --noinput

# Run database migrations
echo "🗄️ Running database migrations..."
python manage.py migrate --noinput

# Check Django configuration
echo "✅ Verifying Django configuration..."
python manage.py check

echo "🎉 Build completed successfully!"
echo "🚀 Starting Gunicorn with: gunicorn wsgi:application"
