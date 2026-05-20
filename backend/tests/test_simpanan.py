import pytest
import pytest
def test_create_simpanan(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    # First need anggota id
    resp = client.get("/api/v1/anggota/me", headers=headers)
    anggota_id = resp.json()["id"]
    
    response = client.post("/api/v1/simpanan/", json={
        "anggota_id": anggota_id,
        "jenis": "Pokok",
        "nominal": 1000000,
        "keterangan": "Setoran awal"
    }, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["jenis"] == "Pokok"
    assert data["nominal"] == 1000000

def test_create_simpanan_negative_nominal(client, admin_token):
    """Edge case: Negative nominal should fail."""
    headers = {"Authorization": f"Bearer {admin_token}"}
    resp = client.get("/api/v1/anggota/me", headers=headers)
    anggota_id = resp.json()["id"]
    
    response = client.post("/api/v1/simpanan/", json={
        "anggota_id": anggota_id,
        "jenis": "Pokok",
        "nominal": -500000,  # Negative
        "keterangan": "Invalid"
    }, headers=headers)
    assert response.status_code == 422  # Validation error

def test_create_simpanan_zero_nominal(client, admin_token):
    """Edge case: Zero nominal should fail."""
    headers = {"Authorization": f"Bearer {admin_token}"}
    resp = client.get("/api/v1/anggota/me", headers=headers)
    anggota_id = resp.json()["id"]
    
    response = client.post("/api/v1/simpanan/", json={
        "anggota_id": anggota_id,
        "jenis": "Pokok",
        "nominal": 0,  # Zero
        "keterangan": "Invalid"
    }, headers=headers)
    assert response.status_code == 422  # Validation error

def test_get_my_simpanan(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.get("/api/v1/simpanan/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "simpanan" in data

def test_create_angsuran_insufficient_saldo(client, admin_token):
    """Edge case: Angsuran with insufficient saldo should fail."""
    headers = {"Authorization": f"Bearer {admin_token}"}
    resp = client.get("/api/v1/anggota/me", headers=headers)
    anggota_id = resp.json()["id"]
    
    # First, add some saldo (Pokok 500k)
    client.post("/api/v1/simpanan/", json={
        "anggota_id": anggota_id,
        "jenis": "Pokok",
        "nominal": 500000,
        "keterangan": "Setoran"
    }, headers=headers)
    
    # Try to withdraw 1M (more than saldo)
    response = client.post("/api/v1/simpanan/", json={
        "anggota_id": anggota_id,
        "jenis": "angsuran",
        "nominal": -1000000,  # More than saldo 500k
        "keterangan": "Angsuran pinjaman"
    }, headers=headers)
    assert response.status_code == 400  # Insufficient saldo
    assert "Saldo tidak cukup" in response.json()["message"]
