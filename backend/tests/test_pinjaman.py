import pytest
import pytest
def test_create_pinjaman(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    # Get anggota id
    resp = client.get("/api/v1/anggota/me", headers=headers)
    anggota_id = resp.json()["id"]
    
    response = client.post("/api/v1/pinjaman/", json={
        "anggota_id": anggota_id,
        "nominal": 5000000,
        "margin_persen": 5.0,  # 5% per tahun (syariah)
        "tenor_bulan": 10
    }, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["nominal"] == 5000000
    assert data["margin_persen"] == 5.0
    assert data["tenor_bulan"] == 10

def test_create_pinjaman_negative_nominal(client, admin_token):
    """Edge case: Negative nominal should fail."""
    headers = {"Authorization": f"Bearer {admin_token}"}
    resp = client.get("/api/v1/anggota/me", headers=headers)
    anggota_id = resp.json()["id"]
    
    response = client.post("/api/v1/pinjaman/", json={
        "anggota_id": anggota_id,
        "nominal": -1000000,  # Negative
        "margin_persen": 5.0,
        "tenor_bulan": 10
    }, headers=headers)
    assert response.status_code == 422  # Validation error

def test_create_pinjaman_zero_nominal(client, admin_token):
    """Edge case: Zero nominal should fail."""
    headers = {"Authorization": f"Bearer {admin_token}"}
    resp = client.get("/api/v1/anggota/me", headers=headers)
    anggota_id = resp.json()["id"]
    
    response = client.post("/api/v1/pinjaman/", json={
        "anggota_id": anggota_id,
        "nominal": 0,  # Zero
        "margin_persen": 5.0,
        "tenor_bulan": 10
    }, headers=headers)
    assert response.status_code == 422  # Validation error

def test_create_pinjaman_zero_tenor(client, admin_token):
    """Edge case: Zero tenor should fail."""
    headers = {"Authorization": f"Bearer {admin_token}"}
    resp = client.get("/api/v1/anggota/me", headers=headers)
    anggota_id = resp.json()["id"]
    
    response = client.post("/api/v1/pinjaman/", json={
        "anggota_id": anggota_id,
        "nominal": 5000000,
        "margin_persen": 5.0,
        "tenor_bulan": 0  # Zero tenor
    }, headers=headers)
    assert response.status_code == 422  # Validation error

def test_create_pinjaman_exceeds_50m(client, admin_token):
    """Edge case: Pinjaman >50M should fail."""
    headers = {"Authorization": f"Bearer {admin_token}"}
    resp = client.get("/api/v1/anggota/me", headers=headers)
    anggota_id = resp.json()["id"]
    
    response = client.post("/api/v1/pinjaman/", json={
        "anggota_id": anggota_id,
        "nominal": 60000000,  # 60M > 50M
        "margin_persen": 5.0,
        "tenor_bulan": 10
    }, headers=headers)
    assert response.status_code == 422  # Validation error

def test_get_my_pinjaman(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.get("/api/v1/pinjaman/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "pinjaman" in data
