# backend/app/api/v1/routes/auth_helpers.py
from datetime import datetime, timedelta, timezone
import sqlite3
import os

# Use SQLite for persistent rate limiting
DB_PATH = os.path.join(os.path.expanduser('~'), 'workspace', 'koperasi_mini', 'backend', 'rate_limit.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute('''
        CREATE TABLE IF NOT EXISTS failed_attempts (
            email TEXT PRIMARY KEY,
            count INTEGER DEFAULT 0,
            last_attempt REAL,
            blocked_until REAL
        )
    ''')
    conn.commit()
    conn.close()

init_db()  # Initialize on import

MAX_ATTEMPTS = 5
BLOCK_DURATION = 15 * 60  # 15 minutes in seconds

def is_blocked(email: str) -> tuple[bool, str]:
    """Check if email is blocked. Returns (is_blocked, message)."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT count, blocked_until FROM failed_attempts WHERE email = ?', (email,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return False, ""
    
    count, blocked_until = row
    now = datetime.now().timestamp()
    
    if blocked_until and blocked_until > now:
        remaining = int(blocked_until - now)
        return True, f"Too many failed attempts. Try again in {remaining // 60} minutes."
    
    # Reset if block expired
    if blocked_until and blocked_until <= now:
        conn = sqlite3.connect(DB_PATH)
        conn.execute('DELETE FROM failed_attempts WHERE email = ?', (email,))
        conn.commit()
        conn.close()
        return False, ""
    
    return False, ""

def record_failed_attempt(email: str):
    """Record a failed login attempt."""
    now = datetime.now().timestamp()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT count FROM failed_attempts WHERE email = ?', (email,))
    row = cursor.fetchone()
    
    if not row:
        cursor.execute('INSERT INTO failed_attempts (email, count, last_attempt) VALUES (?, 1, ?)', (email, now))
    else:
        new_count = row[0] + 1
        cursor.execute('UPDATE failed_attempts SET count = ?, last_attempt = ? WHERE email = ?', (new_count, now, email))
        
        # Block if max attempts reached
        if new_count >= MAX_ATTEMPTS:
            cursor.execute('UPDATE failed_attempts SET blocked_until = ? WHERE email = ?', (now + BLOCK_DURATION, email))
    
    conn.commit()
    conn.close()

def reset_attempts(email: str):
    """Reset failed attempts on successful login."""
    conn = sqlite3.connect(DB_PATH)
    conn.execute('DELETE FROM failed_attempts WHERE email = ?', (email,))
    conn.commit()
    conn.close()
