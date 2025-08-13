#!/usr/bin/env python
"""
Performance monitoring script for EcoVision backend
Run this to identify slow database queries and performance bottlenecks
"""

import os
import sys
import django
import time
from django.db import connection
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from accounts.models import Profile

def monitor_query_performance():
    """Monitor the performance of common authentication queries"""
    
    print("🔍 Monitoring Authentication Query Performance...")
    print("=" * 50)
    
    # Test User creation performance
    start_time = time.time()
    try:
        # Test username lookup performance
        start = time.time()
        User.objects.filter(username='test_user_performance').exists()
        lookup_time = time.time() - start
        print(f"✅ Username lookup: {lookup_time:.4f} seconds")
        
        # Test profile creation performance
        start = time.time()
        user = User.objects.create_user(
            username=f'perf_test_{int(time.time())}',
            email='perf@test.com',
            password='testpass123'
        )
        profile = Profile.objects.create(
            user=user,
            user_type='buyer',
            state='Test State',
            municipality='Test Municipality',
            nin='123456789'
        )
        creation_time = time.time() - start
        print(f"✅ User + Profile creation: {creation_time:.4f} seconds")
        
        # Test authentication performance
        start = time.time()
        from django.contrib.auth import authenticate
        user = authenticate(username=user.username, password='testpass123')
        auth_time = time.time() - start
        print(f"✅ Authentication: {auth_time:.4f} seconds")
        
        # Test profile retrieval performance
        start = time.time()
        profile = Profile.objects.select_related('user').get(user=user)
        retrieval_time = time.time() - start
        print(f"✅ Profile retrieval: {retrieval_time:.4f} seconds")
        
        # Cleanup test data
        user.delete()
        
    except Exception as e:
        print(f"❌ Error during performance test: {e}")
    
    # Database connection info
    print("\n📊 Database Connection Info:")
    print(f"Database Engine: {settings.DATABASES['default']['ENGINE']}")
    print(f"Connection Max Age: {getattr(settings, 'CONN_MAX_AGE', 'Not set')}")
    
    # Check if indexes exist
    print("\n🔍 Checking Database Indexes:")
    with connection.cursor() as cursor:
        cursor.execute("PRAGMA index_list(accounts_profile);")
        indexes = cursor.fetchall()
        if indexes:
            print("✅ Profile table indexes found:")
            for index in indexes:
                print(f"   - {index[1]}")
        else:
            print("❌ No indexes found on Profile table")
    
    print("\n💡 Performance Recommendations:")
    if lookup_time > 0.1:
        print("   - Username lookup is slow, consider adding database index")
    if creation_time > 0.5:
        print("   - User creation is slow, consider optimizing database operations")
    if auth_time > 0.2:
        print("   - Authentication is slow, check password hashing")
    if retrieval_time > 0.1:
        print("   - Profile retrieval is slow, consider using select_related")

if __name__ == '__main__':
    monitor_query_performance()
