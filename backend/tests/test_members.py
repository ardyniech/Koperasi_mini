import pytest

def test_get_me(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.get("/api/v1/anggota/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "email" in data

def test_get_dashboard(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.get("/api/v1/anggota/me/dashboard", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "saldo" in data
    assert "pinjaman_aktif" in data
