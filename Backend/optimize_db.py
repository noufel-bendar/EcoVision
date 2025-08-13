#!/usr/bin/env python
"""
Database optimization script for EcoVision backend
This script optimizes the SQLite database for better performance
"""

import os
import sys
import django
import sqlite3
from pathlib import Path

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings

def optimize_sqlite_database():
    """Optimize SQLite database for better performance"""
    
    db_path = Path(settings.BASE_DIR) / 'db.sqlite3'
    
    if not db_path.exists():
        print("❌ Database file not found")
        return
    
    print("🔧 Optimizing SQLite Database...")
    print("=" * 40)
    
    try:
        # Connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get current database size
        cursor.execute("PRAGMA page_count;")
        page_count = cursor.fetchone()[0]
        cursor.execute("PRAGMA page_size;")
        page_size = cursor.fetchone()[0]
        current_size = page_count * page_size
        
        print(f"📊 Current database size: {current_size / 1024:.2f} KB")
        
        # Enable WAL mode for better concurrency
        cursor.execute("PRAGMA journal_mode=WAL;")
        journal_mode = cursor.fetchone()[0]
        print(f"✅ Journal mode: {journal_mode}")
        
        # Set page size to optimal value
        cursor.execute("PRAGMA page_size=4096;")
        print("✅ Page size set to 4096 bytes")
        
        # Set cache size (in pages)
        cursor.execute("PRAGMA cache_size=10000;")
        print("✅ Cache size set to 10000 pages")
        
        # Set temp store to memory for better performance
        cursor.execute("PRAGMA temp_store=MEMORY;")
        print("✅ Temp store set to memory")
        
        # Set synchronous to NORMAL for better performance
        cursor.execute("PRAGMA synchronous=NORMAL;")
        print("✅ Synchronous mode set to NORMAL")
        
        # Set foreign keys
        cursor.execute("PRAGMA foreign_keys=ON;")
        print("✅ Foreign keys enabled")
        
        # Analyze tables for better query planning
        cursor.execute("ANALYZE;")
        print("✅ Database analyzed for better query planning")
        
        # Vacuum database to reclaim space
        cursor.execute("VACUUM;")
        print("✅ Database vacuumed")
        
        # Get optimized database size
        cursor.execute("PRAGMA page_count;")
        new_page_count = cursor.fetchone()[0]
        cursor.execute("PRAGMA page_size;")
        new_page_size = cursor.fetchone()[0]
        new_size = new_page_count * new_page_size
        
        print(f"📊 New database size: {new_size / 1024:.2f} KB")
        
        # Create indexes for better performance
        print("\n🔍 Creating additional indexes...")
        
        # Index for User model
        try:
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_user_username ON auth_user(username);")
            print("✅ Username index created")
        except:
            print("ℹ️ Username index already exists")
        
        try:
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_user_email ON auth_user(email);")
            print("✅ Email index created")
        except:
            print("ℹ️ Email index already exists")
        
        # Commit changes
        conn.commit()
        print("\n✅ Database optimization completed successfully!")
        
        # Show database statistics
        print("\n📊 Database Statistics:")
        cursor.execute("PRAGMA stats;")
        stats = cursor.fetchall()
        for stat in stats:
            print(f"   {stat[0]}: {stat[1]}")
        
    except Exception as e:
        print(f"❌ Error optimizing database: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    optimize_sqlite_database()
