#!/usr/bin/env python
"""
Deployment verification script for EcoVision backend
Run this before deploying to ensure everything is configured correctly
"""

import os
import sys
from pathlib import Path

def verify_deployment_config():
    """Verify that all deployment configurations are correct"""
    
    print("🔍 Verifying Deployment Configuration...")
    print("=" * 50)
    
    # Check if wsgi.py exists and is importable
    try:
        import wsgi
        print("✅ wsgi.py is importable")
        print(f"   Application type: {type(wsgi.application)}")
    except Exception as e:
        print(f"❌ wsgi.py import failed: {e}")
        return False
    
    # Check if config/settings.py exists
    settings_path = Path("config/settings.py")
    if settings_path.exists():
        print("✅ config/settings.py exists")
    else:
        print("❌ config/settings.py not found")
        return False
    
    # Check if render.yaml exists
    render_path = Path("render.yaml")
    if render_path.exists():
        print("✅ render.yaml exists")
        
        # Read and verify render.yaml content
        with open(render_path, 'r') as f:
            content = f.read()
            if 'gunicorn wsgi:application' in content:
                print("✅ render.yaml has correct start command")
            else:
                print("❌ render.yaml has incorrect start command")
                return False
    else:
        print("❌ render.yaml not found")
        return False
    
    # Check if Procfile exists
    procfile_path = Path("Procfile")
    if procfile_path.exists():
        print("✅ Procfile exists")
        
        # Read and verify Procfile content
        with open(procfile_path, 'r') as f:
            content = f.read()
            if 'gunicorn wsgi:application' in content:
                print("✅ Procfile has correct start command")
            else:
                print("❌ Procfile has incorrect start command")
                return False
    else:
        print("❌ Procfile not found")
        return False
    
    # Check if requirements.txt exists
    requirements_path = Path("requirements.txt")
    if requirements_path.exists():
        print("✅ requirements.txt exists")
    else:
        print("❌ requirements.txt not found")
        return False
    
    # Check if runtime.txt exists
    runtime_path = Path("runtime.txt")
    if runtime_path.exists():
        print("✅ runtime.txt exists")
    else:
        print("❌ runtime.txt not found")
        return False
    
    # Test Django configuration
    try:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
        import django
        django.setup()
        print("✅ Django configuration is valid")
    except Exception as e:
        print(f"❌ Django configuration failed: {e}")
        return False
    
    print("\n🎉 All deployment configurations are correct!")
    print("\n📋 Deployment Checklist:")
    print("   ✅ WSGI configuration")
    print("   ✅ Django settings")
    print("   ✅ Render configuration")
    print("   ✅ Procfile")
    print("   ✅ Requirements")
    print("   ✅ Runtime specification")
    
    print("\n🚀 Ready to deploy!")
    print("   Push your changes to GitHub and Render will auto-deploy")
    print("   Make sure to use: gunicorn wsgi:application")
    
    return True

if __name__ == '__main__':
    success = verify_deployment_config()
    sys.exit(0 if success else 1)
