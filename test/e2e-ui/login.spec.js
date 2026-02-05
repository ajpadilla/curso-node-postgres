// e2e-ui/login.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Login Page', () => {
  test('should login successfully and redirect to dashboard', async ({ page }) => {
    // 1️⃣ Go to login page
    await page.goto('http://localhost:3000/api/v1/login');

    // 2️⃣ Fill form
    await page.fill('#email', 'user@test.com');
    await page.fill('#password', '12345678');

    // 3️⃣ Click login
    await page.click('button[type="submit"]');

    // 4️⃣ Wait for redirect
    await page.waitForURL('**/api/v1/dashboard');

    // 5️⃣ Verify dashboard content
    await expect(page).toHaveURL(/dashboard/);
  });
});
