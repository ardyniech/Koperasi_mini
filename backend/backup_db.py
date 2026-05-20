#!/usr/bin/env python3
"""
Automated SQLite database backup for Koperasi Mini.
Backs up db.sqlite3 to backups/ with timestamp.
"""
import os
import shutil
import datetime

DB_PATH = os.path.join(os.path.expanduser('~'), 'koperasi_mini', 'backend', 'db.sqlite3')
BACKUP_DIR = os.path.join(os.path.expanduser('~'), 'koperasi_mini', 'backend', 'backups')

def backup_database():
    os.makedirs(BACKUP_DIR, exist_ok=True)
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = os.path.join(BACKUP_DIR, f'db_backup_{timestamp}.sqlite3')
    shutil.copy2(DB_PATH, backup_path)
    print(f"✅ Database backed up to {backup_path}")
    # Keep only last 7 backups
    backups = sorted([f for f in os.listdir(BACKUP_DIR) if f.startswith('db_backup_')], reverse=True)
    for old_backup in backups[7:]:
        os.remove(os.path.join(BACKUP_DIR, old_backup))
        print(f"🗑️ Removed old backup: {old_backup}")

if __name__ == '__main__':
    backup_database()
