# backend/tests/conftest_helpers.py
from app.models.anggota import Anggota

def promote_to_admin(db_func, email="admin@koperasi.com"):
    """Promote a user to admin role via DB."""
    db = next(db_func())
    try:
        user = db.query(Anggota).filter(Anggota.email == email).first()
        user.role = "admin"
        db.commit()
        db.refresh(user)
        return user
    finally:
        db.close()

def get_test_user_data(password="test123"):
    """Return test user data."""
    return {
        "nama": "Test User",
        "email": "test@koperasi.com",
        "password": password,
        "no_wa": "0811111111"
    }

def get_admin_user_data(password="admin123"):
    """Return admin user data."""
    return {
        "nama": "Admin Test",
        "email": "admin@koperasi.com",
        "password": password,
        "no_wa": "08123456789"
    }

def get_member_user_data(password="member123"):
    """Return member user data."""
    return {
        "nama": "Member Test",
        "email": "member@koperasi.com",
        "password": password,
        "no_wa": "08987654321"
    }
