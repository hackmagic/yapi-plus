#!/usr/bin/env python3
"""Discover buttons, links, and inputs on a page."""
from playwright.sync_api import sync_playwright


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Navigate to page
        page.goto('http://localhost:5173')
        page.wait_for_load_state('networkidle')
        
        # Discover buttons
        buttons = page.locator('button').all()
        print(f"Found {len(buttons)} buttons:")
        for btn in buttons:
            print(f"  - text={btn.text_content()}, role={btn.get_attribute('role')}")
        
        # Discovery links
        links = page.locator('a').all()
        print(f"\nFound {len(links)} links:")
        for link in links:
            print(f"  - text={link.text_content()}, href={link.get_attribute('href')}")
        
        # Discover inputs
        inputs = page.locator('input, textarea, select').all()
        print(f"\nFound {len(inputs)} inputs:")
        for inp in inputs:
            print(f"  - name={inp.get_attribute('name')}, type={inp.get_attribute('type')}, placeholder={inp.get_attribute('placeholder')}")
        
        browser.close()


if __name__ == '__main__':
    main()