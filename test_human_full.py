from playwright.sync_api import sync_playwright
import time
import requests

def test_full_flow():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()
        
        # Capture console
        def handle_console(msg):
            try:
                text = msg.text[:200]
                print(f"[Console {msg.type}] {text}")
            except:
                pass
        page.on("console", handle_console)
        
        base_url = "http://192.168.1.7:8080"
        api_base = "http://192.168.1.7:8000/api/v1"
        
        print("=" * 60)
        print("[TEST] KOPERASI MINI SYARIAH - FULL HUMAN TEST")
        print("=" * 60)
        
        # ========== 1. TEST LOGIN ==========
        print("\n[1] Testing LOGIN...")
        page.goto(f"{base_url}/", timeout=30000)
        page.wait_for_load_state('networkidle')
        
        try:
            page.wait_for_selector("button:has-text('Login')", timeout=5000)
            page.locator("button:has-text('Login')").first.click()
            page.wait_for_timeout(1000)
            
            page.wait_for_selector("input[placeholder*='email']", timeout=5000)
            page.fill("input[placeholder*='email']", "admin@koperasi.com")
            page.fill("input[type='password']", "admin123")
            
            submit = page.locator(".glass-card button:has-text('Login')").last
            submit.click(force=True)
            page.wait_for_timeout(5000)
            
            token = page.evaluate("window.localStorage.getItem('token')")
            url = page.url
            
            if token and "/dashboard" in url:
                print(f"[1] ✅ LOGIN SUCCESS - Token: {token[:20]}...")
            else:
                print(f"[1] ❌ LOGIN FAILED - URL: {url}, Token: {token}")
                page.screenshot(path="/tmp/test_login_fail.png")
        except Exception as e:
            print(f"[1] ❌ LOGIN ERROR: {e}")
            page.screenshot(path="/tmp/test_login_error.png")
        
        # Save token for API tests
        token = page.evaluate("window.localStorage.getItem('token')")
        
        # ========== 2. TEST DASHBOARD ==========
        print("\n[2] Testing DASHBOARD...")
        try:
            page.goto(f"{base_url}/dashboard", timeout=30000)
            page.wait_for_timeout(3000)
            
            if "/dashboard" in page.url.lower():
                print("[2] ✅ DASHBOARD ACCESSIBLE")
                
                page_content = page.content().lower()
                if "saldo" in page_content or "simpanan" in page_content:
                    print("[2] ✅ DASHBOARD CONTENT LOADED")
                else:
                    print("[2] ⚠️ DASHBOARD CONTENT NOT DETECTED")
            else:
                print(f"[2] ❌ DASHBOARD NOT ACCESSIBLE - URL: {page.url}")
        except Exception as e:
            print(f"[2] ❌ DASHBOARD ERROR: {e}")
        
        # ========== 3. TEST SIMPANAN (DEPOSIT) ==========
        print("\n[3] Testing SIMPANAN (Deposit)...")
        try:
            page.goto(f"{base_url}/simpanan/input", timeout=30000)
            page.wait_for_timeout(3000)
            
            if "/simpanan/input" in page.url:
                print("[3] ✅ SIMPANAN PAGE ACCESSIBLE")
            else:
                print(f"[3] ⚠️ SIMPANAN PAGE - URL: {page.url}")
        except Exception as e:
            print(f"[3] ❌ SIMPANAN ERROR: {e}")
        
        # ========== 4. TEST PINJAMAN (LOAN) ==========
        print("\n[4] Testing PINJAMAN (Loan)...")
        try:
            page.goto(f"{base_url}/pinjaman/input", timeout=30000)
            page.wait_for_timeout(3000)
            
            if "/pinjaman/input" in page.url:
                print("[4] ✅ PINJAMAN PAGE ACCESSIBLE")
            else:
                print(f"[4] ⚠️ PINJAMAN PAGE - URL: {page.url}")
        except Exception as e:
            print(f"[4] ❌ PINJAMAN ERROR: {e}")
        
        # ========== 5. TEST ANGSURAN (PAYMENT) ==========
        print("\n[5] Testing ANGSURAN (Payment)...")
        try:
            page.goto(f"{base_url}/angsuran/input", timeout=30000)
            page.wait_for_timeout(3000)
            
            if "/angsuran/input" in page.url:
                print("[5] ✅ ANGSURAN PAGE ACCESSIBLE")
            else:
                print(f"[5] ⚠️ ANGSURAN PAGE - URL: {page.url}")
        except Exception as e:
            print(f"[5] ❌ ANGSURAN ERROR: {e}")
        
        # ========== 6. TEST API DIRECT ==========
        print("\n[6] Testing API DIRECT (Backend)...")
        
        if token:
            headers = {"Authorization": f"Bearer {token}"}
            
            # Test me endpoint
            try:
                resp = requests.get(f"{api_base}/auth/me", headers=headers, timeout=10)
                if resp.status_code == 200:
                    data = resp.json()
                    print(f"[6] ✅ API /auth/me SUCCESS - {data.get('nama', 'N/A')}")
                else:
                    print(f"[6] ❌ API /auth/me FAILED - {resp.status_code}")
            except Exception as e:
                print(f"[6] ❌ API /auth/me ERROR: {e}")
            
            # Test saldo endpoint
            try:
                resp = requests.get(f"{api_base}/simpanan/me", headers=headers, timeout=10)
                if resp.status_code == 200:
                    print(f"[6] ✅ API /simpanan/me SUCCESS")
                else:
                    print(f"[6] ⚠️ API /simpanan/me STATUS: {resp.status_code}")
            except Exception as e:
                print(f"[6] ❌ API /simpanan/me ERROR: {e}")
            
            # Test pinjaman endpoint
            try:
                resp = requests.get(f"{api_base}/pinjaman/me", headers=headers, timeout=10)
                if resp.status_code == 200:
                    print(f"[6] ✅ API /pinjaman/me SUCCESS")
                else:
                    print(f"[6] ⚠️ API /pinjaman/me STATUS: {resp.status_code}")
            except Exception as e:
                print(f"[6] ❌ API /pinjaman/me ERROR: {e}")
        else:
            print("[6] ❌ NO TOKEN - Cannot test API")
        
        # ========== SUMMARY ==========
        print("\n" + "=" * 60)
        print("[SUMMARY] TEST COMPLETED")
        print("=" * 60)
        print("Check screenshots in /tmp/ for failures")
        
        browser.close()

if __name__ == "__main__":
    test_full_flow()
