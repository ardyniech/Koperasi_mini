from scrapling.fetchers import DynamicFetcher

print("[Test] Starting DynamicFetcher...")
try:
    # DynamicFetcher uses Playwright underneath
    page = DynamicFetcher.fetch('http://192.168.1.7:8080', headless=True, network_idle=True)
    
    print("[Test] Page loaded, waiting for login button...")
    page.wait_for_selector("button:has-text('Login')", timeout=5000)
    
    # Open popup
    page.locator("button:has-text('Login')").first.click()
    print("[Test] Popup opened")
    
    # Fill form
    page.wait_for_selector("input[placeholder*='email']", timeout=5000)
    page.fill("input[placeholder*='email']", "admin@koperasi.com")
    page.fill("input[type='password']", "admin123")
    print("[Test] Form filled")
    
    # Submit
    submit = page.locator(".glass-card button:has-text('Login')").last
    submit.click(force=True)
    print("[Test] Submitted, waiting...")
    
    page.wait_for_timeout(5000)
    
    # Check results
    print(f"[Test] URL: {page.url}")
    token = page.evaluate("window.localStorage.getItem('token')")
    print(f"[Test] Token: {token}")
    
    if "/dashboard" in page.url:
        print("[Test] ✅ Login SUCCESS!")
    else:
        print("[Test] ❌ Login FAILED")
    
    page.close()
except Exception as e:
    print(f"[Test] Error: {e}")
    import traceback
    traceback.print_exc()
