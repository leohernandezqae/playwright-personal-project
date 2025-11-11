import { test, expect } from '@playwright/test';
import { createAuthenticatedContext } from './utils/apiContext';

test('get users', async () => {
  const api = await createAuthenticatedContext();
  const response = await api.get('/users');
  expect(response.ok()).toBeTruthy();
});
