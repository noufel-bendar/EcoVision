"""
WSGI config for EcoVision project.
This file serves as the entry point for WSGI servers like Gunicorn.
"""

import os
import sys
from pathlib import Path

# Get the absolute path to the Backend directory
BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent

# Add the Backend directory to the Python path
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# Add the project root to the Python path (in case we need it)
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Set the working directory to the Backend directory
os.chdir(BACKEND_DIR)

# Import Django and get the WSGI application
from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()

# For debugging deployment issues
if __name__ == "__main__":
    print(f"Backend directory: {BACKEND_DIR}")
    print(f"Project root: {PROJECT_ROOT}")
    print(f"Python path: {sys.path}")
    print(f"Settings module: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
    print(f"Working directory: {os.getcwd()}")
