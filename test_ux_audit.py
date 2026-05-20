#!/usr/bin/env python3
"""
Playwright UX Audit - Koperasi Mini Syariah (Simplified)
Tests: LandingPage, Register, StoryBehind, ProposalBisnis
"""
import asyncio
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout

BASE_URL = "http://localhost:5173"

async def test_page(page, name, path, check_text):
    """Generic page test"""
    print(f"\n[TEST] {name} ({path})...")
    try:
        response = await page.goto(f"{BASE_URL}{path}", timeout=15000, wait_until='load')
        if not response:
            print(f"  ❌ No response for {path}")
            return False
        
        # Wait a bit for JS to render
        await page.wait_for_timeout(2000)
        
        # Check content
        content = await page.content()
        if check_text in content:
            print(f"  ✅ {name} loaded successfully")
            return True
        else:
            print(f"  ⚠️ {name} loaded but missing '{check_text}'")
            # Take screenshot
            await page.screenshot(path=f"/tmp/{name.replace(' ', '_')}.png")
            return False
    except PlaywrightTimeout:
        print(f"  ❌ Timeout loading {path}")
        return False
    except Exception as e:
        print(f"  ❌ Error: {str(e)[:100]}")
        return False

async def main():
    print("=" * 60)
    print("PLAYWRIGHT UX AUDIT - KOPERASI MINI SYARIAH")
    print("=" * 60)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-setuid-sandbox']
        )
        page = await browser.new_page()
        
        results = []
        
        # Test 1: LandingPage
        results.append(await test_page(
            page, "LandingPage", "/", "Koperasi"
        ))
        
        # Test 2: Register Page
        results.append(await test_page(
            page, "Register Page", "/register", "Daftar"
        ))
        
        # Test 3: StoryBehind (protected - will redirect to login or show error)
        # Since Login.tsx is removed, just check if page loads (might show 404 or redirect)
        results.append(await test_page(
            page, "StoryBehind", "/story-behind", "Story Behind"
        ))
        
        # Test 4: ProposalBisnis (protected)
        results.append(await test_page(
            page, "ProposalBisnis", "/proposal-bisnis", "Proposal Bisnis"
        ))
        
        # Test 5: Dashboard (protected - might redirect)
        results.append(await test_page(
            page, "Dashboard", "/dashboard", "Dashboard"
        ))
        
        await browser.close()
        
        # Summary
        print("\n" + "=" * 60)
        print("AUDIT SUMMARY")
        print("=" * 60)
        passed = sum(1 for r in results if r)
        total = len(results)
        print(f"Passed: {passed}/{total}")
        
        if passed == total:
            print("✅ ALL TESTS PASSED!")
        else:
            print(f"⚠️ {total - passed} test(s) failed or partially failed")
        
        print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
