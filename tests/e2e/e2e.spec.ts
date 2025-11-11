import { test, expect } from '@playwright/test';
import { PageLogin } from './pages/page.login';
import { insertScreenShot } from './utils/e2e.utils';

test.describe('Login screen', () => {
  test.beforeEach(async ({ page }) => {
    const pageLogin = new PageLogin(page);

    await page.goto('/login.html');
    await expect(pageLogin.loginTittle).toContainText('🔐 Login');
  });

  test('Password security validation', async ({ page }, testInfo) => {
    const pageLogin = new PageLogin(page);
    
    await insertScreenShot(page, testInfo);
    await pageLogin.passwordInput.fill('aaaaaaaa');
    await expect(pageLogin.lenghtReqText).toHaveCSS('color', 'rgb(40, 167, 69)');
    await insertScreenShot(page, testInfo);

    await pageLogin.passwordInput.fill('A');
    await expect(pageLogin.upperCaseReqText).toHaveCSS('color', 'rgb(40, 167, 69)');
    await expect(page.locator('span.valid')).toHaveCount(1);
    await insertScreenShot(page, testInfo);

    await pageLogin.passwordInput.fill('1');
    await expect(pageLogin.numberReqText).toHaveCSS('color', 'rgb(40, 167, 69)');
    await expect(page.locator('span.valid')).toHaveCount(1);
    await insertScreenShot(page, testInfo);

    await pageLogin.passwordInput.fill('@');
    await expect(pageLogin.specialReqText).toHaveCSS('color', 'rgb(40, 167, 69)');
    await expect(page.locator('span.valid')).toHaveCount(1);
    await insertScreenShot(page, testInfo);

    await pageLogin.passwordInput.fill('Admin@12');
    await expect(page.locator('span.valid')).toHaveCount(4);
  });

  test('Login successfuly', async ({ page }) => {
    const pageLogin = new PageLogin(page);

    await pageLogin.loginInput.fill('admin');
    await pageLogin.passwordInput.fill('Admin@123');
    await pageLogin.loginButton.click();
    await expect(page.getByTestId('session-timer')).toBeVisible();
  });
});