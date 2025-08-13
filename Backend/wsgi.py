"""
WSGI config for EcoVision project.
This file serves as the entry point for WSGI servers like Gunicorn.
"""

import os
import sys

# Add the Backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Import Django and get the WSGI application
from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()
