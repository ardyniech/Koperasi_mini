import pytest
from app.models.anggota import Anggota
from app.core.security import get_password_hash

@pytest.fixture
def admin_user(client):
    # Register admin
    response = client.post("/api/v1/auth/register", json={
        "nama": "Admin Test",
        "email": "admin_test@koperasi.com",
        "password": "admin123",
        "no_wa": "08123456789"
    })
    # Force promote to admin (manual DB update)
    from sqlalchemy.orm import sessionmaker
    from sqlalchemy import create_engine
    engine = create_engine("sqlite:///./test.db")
    Session = sessionmaker(bind=engine)
    db = Session()
    user = db.query(Anggota).filter(Anggota.email == "admin_test@koperasi.com").first()
    user.role = "admin"
    db.commit()
    db.close()
    return response.json()

@pytest.fixture
def admin_token(client, admin_user):
    response = client.post("/api/v1/auth/login", json={
        "email": "admin_test@koperasi.com",
        "password": "admin123"
    })
    return response.json()["access_token"]

@pytest.fixture
def member_user(client):
    response = client.post("/api/v1/auth/register", json={
        "nama": "Member Test",
        "email": "member@koperasi.com",
        "password": "member123",
        "no_wa": "08987654321"
    })
    return response.json()

@pytest.fixture
def member_token(client, member_user):
    response = client.post("/api/v1/auth/login", json={
        "email": "member@koperasi.com",
        "password": "member123"
    })
    return response.json()["access_token"]
