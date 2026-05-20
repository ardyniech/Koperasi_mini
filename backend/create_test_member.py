#!/usr/bin/env python3
"""Create test member account for login testing."""
import requests
import json

BASE_URL = "http://localhost:8006/api/v1"

# 1. Login as admin
print("1. Logging in as admin...")
r = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "admin@koperasi.com",
    "password": "admin123"
})
if r.status_code != 200:
    print(f"❌ Admin login failed: {r.text}")
    exit(1)
admin_token = r.json()["access_token"]
print(f"✅ Admin token obtained")

# 2. Create test member
print("\n2. Creating test member...")
r = requests.post(f"{BASE_URL}/auth/register", 
    headers={"Authorization": f"Bearer {admin_token}"},
    json={
        "nama": "Test Anggota Login",
        "email": "testlogin@koperasi.com",
        "password": "testlogin123",
        "no_wa": "081234567890"
    }
)
if r.status_code == 200:
    data = r.json()
    print(f"✅ Test member created!")
    print(f"   ID: {data['id']}")
    print(f"   Nama: {data['nama']}")
    print(f"   Email: {data['email']}")
    print(f"   Role: {data['role']}")
    print(f"   Status: {data['status']}")
    print(f"\n📝 CREDENTIALS FOR TESTING:")
    print(f"   Email: testlogin@koperasi.com")
    print(f"   Password: testlogin123")
elif r.status_code == 400 and "sudah terdaftar" in r.json().get("detail", ""):
    print("⚠️ Test member already exists, using existing account")
    print(f"\n📝 CREDENTIALS FOR TESTING:")
    print(f"   Email: testlogin@koperasi.com")
    print(f"   Password: testlogin123")
else:
    print(f"❌ Failed to create member: {r.status_code} - {r.text}")
