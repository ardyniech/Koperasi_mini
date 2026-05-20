from playwright.sync_api import sync_playwright
import time

def test_with_screenshots():
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
        
        print("=" * 60)
        print("[TEST] KOPERASI MINI - SCREENSHOT TEST")
        print("=" * 60)
        
        # ========== 1. LANDING PAGE ==========
        print("\n[1] Loading LANDING PAGE...")
        page.goto(f"{base_url}/", timeout=30000)
        page.wait_for_load_state('networkidle')
        page.screenshot(path="/tmp/01_landing.png", full_page=True)
        print("[1] ✅ Screenshot: /tmp/01_landing.png")
        
        # ========== 2. CLICK LOGIN ==========
        print("\n[2] Clicking LOGIN button...")
        try:
            page.wait_for_selector("button:has-text('Login')", timeout=5000)
            page.locator("button:has-text('Login')").first.click()
            page.wait_for_timeout(1000)
            page.screenshot(path="/tmp/02_login_popup.png")
            print("[2] ✅ Screenshot: /tmp/02_login_popup.png")
        except Exception as e:
            print(f"[2] ❌ Error: {e}")
        
        # ========== 3. FILL LOGIN FORM ==========
        print("\n[3] Filling LOGIN FORM...")
        try:
            page.wait_for_selector("input[placeholder*='email']", timeout=5000)
            page.fill("input[placeholder*='email']", "admin@koperasi.com")
            page.fill("input[type='password']", "admin123")
            page.screenshot(path="/tmp/03_login_filled.png")
            print("[3] ✅ Screenshot: /tmp/03_login_filled.png")
        except Exception as e:
            print(f"[3] ❌ Error: {e}")
        
        # ========== 4. SUBMIT LOGIN ==========
        print("\n[4] Submitting LOGIN...")
        try:
            submit = page.locator(".glass-card button:has-text('Login')").last
            submit.click(force=True)
            page.wait_for_timeout(5000)
            page.screenshot(path="/tmp/04_after_login.png")
            print("[4] ✅ Screenshot: /tmp/04_after_login.png")
            print(f"[4] Current URL: {page.url}")
        except Exception as e:
            print(f"[4] ❌ Error: {e}")
        
        # ========== 5. CHECK DASHBOARD ==========
        print("\n[5] Checking DASHBOARD...")
        try:
            token = page.evaluate("window.localStorage.getItem('token')")
            url = page.url
            
            if token and "/dashboard" in url:
                print(f"[5] ✅ LOGIN SUCCESS!")
                print(f"[5] Token: {token[:30]}...")
                page.screenshot(path="/tmp/05_dashboard.png", full_page=True)
                print("[5] ✅ Screenshot: /tmp/05_dashboard.png")
            else:
                print(f"[5] ❌ LOGIN FAILED")
                print(f"[5] URL: {url}")
                print(f"[5] Token exists: {bool(token)}")
        except Exception as e:
            print(f"[5] ❌ Error: {e}")
        
        # ========== 6. TEST SIMPANAN ==========
        print("\n[6] Testing SIMPANAN...")
        try:
            page.goto(f"{base_url}/simpanan/input", timeout=30000)
            page.wait_for_timeout(3000)
            page.screenshot(path="/tmp/06_simpanan.png", full_page=True)
            print("[6] ✅ Screenshot: /tmp/06_simpanan.png")
        except Exception as e:
            print(f"[6] ❌ Error: {e}")
        
        # ========== 7. TEST PINJAMAN ==========
        print("\n[7] Testing PINJAMAN...")
        try:
            page.goto(f"{base_url}/pinjaman/input", timeout=30000)
            page.wait_for_timeout(3000)
            page.screenshot(path="/tmp/07_pinjaman.png", full_page=True)
            print("[7] ✅ Screenshot: /tmp/07_pinjaman.png")
        except Exception as e:
            print(f"[7] ❌ Error: {e}")
        
        browser.close()
        print("\n" + "=" * 60)
        print("[DONE] All screenshots saved to /tmp/")
        print("=" * 60)

if __name__ == "__main__":
    test_with_screenshots()
