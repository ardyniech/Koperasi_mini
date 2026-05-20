from playwright.sync_api import sync_playwright

def test_login_direct_api():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        page = browser.new_page()
        
        print("[Test] Testing API directly from browser...")
        
        # Test API call directly (bypass Vite proxy)
        result = page.evaluate("""
            async () => {
                try {
                    const res = await fetch('http://192.168.1.7:8000/api/v1/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: 'admin@koperasi.com', password: 'admin123' })
                    });
                    const data = await res.json();
                    return { status: res.status, data };
                } catch (e) {
                    return { error: e.toString() };
                }
            }
        """)
        
        print(f"[Test] Direct API result: {result}")
        
        # Now test via Vite proxy
        print("[Test] Testing via Vite proxy...")
        result2 = page.evaluate("""
            async () => {
                try {
                    const res = await fetch('/api/v1/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: 'admin@koperasi.com', password: 'admin123' })
                    });
                    const data = await res.json();
                    return { status: res.status, data };
                } catch (e) {
                    return { error: e.toString() };
                }
            }
        """)
        
        print(f"[Test] Proxy API result: {result2}")
        
        browser.close()

if __name__ == "__main__":
    test_login_direct_api()
