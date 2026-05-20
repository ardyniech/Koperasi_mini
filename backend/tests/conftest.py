import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app as fastapi_app
from app.models.base import Base
from app.db.session import get_db
import app.models  # Trigger all model registration
from tests.conftest_helpers import promote_to_admin, get_admin_user_data, get_member_user_data

@pytest.fixture(scope="function")
def client():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        pool_pre_ping=True
    )
    
    connection = engine.connect()
    Base.metadata.create_all(bind=connection)
    
    TestingSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=connection
    )
    
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()
    
    fastapi_app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(fastapi_app) as c:
        yield c
    
    Base.metadata.drop_all(bind=connection)
    connection.close()
    engine.dispose()
    fastapi_app.dependency_overrides.clear()

@pytest.fixture
def admin_user(client):
    admin_data = get_admin_user_data(password="admin123")
    response = client.post("/api/v1/auth/register", json=admin_data)
    assert response.status_code == 200
    user_data = response.json()
    promote_to_admin(fastapi_app.dependency_overrides[get_db])
    return user_data

@pytest.fixture
def admin_token(client, admin_user):
    response = client.post("/api/v1/auth/login", json={
        "identifier": "admin@koperasi.com",
        "password": "admin123"
    })
    assert response.status_code == 200
    return response.json()["access_token"]

@pytest.fixture
def member_user(client):
    member_data = get_member_user_data(password="member123")
    response = client.post("/api/v1/auth/register", json=member_data)
    assert response.status_code == 200
    return response.json()

@pytest.fixture
def member_token(client, member_user):
    response = client.post("/api/v1/auth/login", json={
        "identifier": "member@koperasi.com",
        "password": "member123"
    })
    assert response.status_code == 200
    return response.json()["access_token"]
