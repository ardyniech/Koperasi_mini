import pytest

def test_register(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.post("/api/v1/auth/register", json={
        "nama": "Test User",
        "email": "test@koperasi.com",
        "password": "testpassword123",
        "no_wa": "0811111111"
    }, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@koperasi.com"
    assert data["role"] == "anggota"

def test_login(client, admin_user):
    # Use the admin_user's email from fixture
    response = client.post("/api/v1/auth/login", json={
        "identifier": admin_user["email"],
        "password": "admin123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password(client, admin_user):
    response = client.post("/api/v1/auth/login", json={
        "identifier": "admin_test@koperasi.com",
        "password": "wrongpassword"
    })
    assert response.status_code in [401, 429]  # Accept both (rate limiting)
