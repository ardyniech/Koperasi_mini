from playwright.sync_api import sync_playwright

def test_login_flow():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        page = browser.new_page()
        
        # Capture console
        def handle_console(msg):
            try:
                print(f"[Console {msg.type}] {msg.text}")
            except:
                pass
        
        page.on("console", handle_console)
        
        responses = []
        def handle_response(resp):
            responses.append(resp)
        
        page.on("response", handle_response)
        
        print("[Test] Navigating to built frontend (port 8080)...")
        page.goto("http://192.168.1.7:8080", timeout=30000)
        page.wait_for_load_state('networkidle')
        
        try:
            # Open login popup
            print("[Test] Opening login popup...")
            page.wait_for_selector("button:has-text('Login')", timeout=5000)
            page.locator("button:has-text('Login')").first.click()
            
            # Wait for popup animation
            page.wait_for_timeout(1000)
            
            # Fill form
            print("[Test] Filling form...")
            page.wait_for_selector("input[placeholder*='email']", timeout=5000)
            page.fill("input[placeholder*='email']", "admin@koperasi.com")
            page.fill("input[type='password']", "admin123")
            
            # Click submit with force
            print("[Test] Submitting login...")
            submit = page.locator(".glass-card button:has-text('Login')").last
            submit.click(force=True)
            
            # Wait for response
            page.wait_for_timeout(5000)
            
            # Check API responses
            print("[Test] Checking network responses...")
            for resp in responses:
                if 'login' in resp.url.lower():
                    print(f"[Network] {resp.url} -> {resp.status}")
                    try:
                        body = resp.json()
                        print(f"[Network] Response: {body}")
                    except:
                        pass
            
            # Check results
            print(f"[Test] URL: {page.url}")
            token = page.evaluate("window.localStorage.getItem('token')")
            print(f"[Test] Token: {token}")
            
            if "/dashboard" in page.url:
                print("[Test] ✅ Login SUCCESS!")
            else:
                print("[Test] ❌ Login FAILED")
                page.screenshot(path="/tmp/test_error.png")
                print(f"[Test] Screenshot: /tmp/test_error.png")
            
        except Exception as e:
            print(f"[Test] Error: {e}")
            page.screenshot(path="/tmp/test_error.png")
        
        browser.close()

if __name__ == "__main__":
    test_login_flow()
