import pytest

def test_create_funding(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    resp = client.get("/api/v1/anggota/me", headers=headers)
    anggota_id = resp.json()["id"]
    
    response = client.post("/api/v1/funding/", json={
        "anggota_id": anggota_id,
        "nominal": 2000000,
        "tujuan_usaha": "Warung Kelontong"
    }, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["nominal"] == 2000000
    assert data["status"] == "Diajukan"

def test_get_my_funding(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.get("/api/v1/funding/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "funding" in data
