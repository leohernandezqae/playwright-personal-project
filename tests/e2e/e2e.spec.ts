import { test, expect } from '@playwright/test';

test('Login title', async ({ page }) => {
  await page.goto('/');

  // Click the get started link.
  await expect(page.getByRole('heading', { name: '🔐 Login' })).toBeVisible();
});

test('Login successfuly', async ({ page }) => {
  await page.goto('/login.html');
  await expect(page.getByTestId('login-title')).toContainText('🔐 Login');

  await page.getByTestId('login-input').click();
  await page.getByTestId('login-input').fill('admin');
  await page.getByTestId('password-input').click();
  await page.getByTestId('password-input').fill('Admin@123');
  await page.getByTestId('submit-btn').click();
  await expect(page.getByTestId('session-timer')).toBeVisible();
});