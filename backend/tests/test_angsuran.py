import pytest

def test_create_pinjaman_then_angsuran(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    # Create pinjaman first
    resp = client.get("/api/v1/anggota/me", headers=headers)
    anggota_id = resp.json()["id"]
    
    pinjaman_resp = client.post("/api/v1/pinjaman/", json={
        "anggota_id": anggota_id,
        "nominal": 3000000,
        "margin_persen": 4.0,
        "tenor_bulan": 6
    }, headers=headers)
    pinjaman_id = pinjaman_resp.json()["id"]
    
    # Get angsuran list
    response = client.get(f"/api/v1/angsuran/?pinjaman_id={pinjaman_id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "angsuran" in data
    assert len(data["angsuran"]) == 6  # 6 bulan tenor

def test_update_angsuran_status(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    # Get angsuran list
    response = client.get("/api/v1/angsuran/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    if len(data["angsuran"]) > 0:
        angsuran_id = data["angsuran"][0]["id"]
        # Update status
        update_resp = client.put(f"/api/v1/angsuran/{angsuran_id}", json={
            "status": "Sudah Bayar"
        }, headers=headers)
        assert update_resp.status_code == 200
