import { test as setup, request } from '@playwright/test';
import fs from 'fs';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async () => {
  // Create an API request context
  const apiContext = await request.newContext();

  // Call your API login endpoint
  const res = await apiContext.post('http://localhost:3000/login', {
    data: {
      login: process.env.USER_LOGIN,
      password: process.env.USER_PASSWORD,
    },
  });

  if (!res.ok()) {
    throw new Error('Login failed: ' + (await res.text()));
  }

  const data = await res.json();

  // Create storageState for Playwright (e.g., localStorage token)
  const storageState = {
    cookies: [], // empty if your app uses JWT in localStorage
    origins: [
      {
        origin: 'http://localhost:3000',
        localStorage: [
          { name: 'token', value: data.token } // adjust if your API returns token
        ],
      },
    ],
  };

  // Save storageState to file
  fs.writeFileSync(authFile, JSON.stringify(storageState, null, 2));

  console.log('✅ API login successful. Storage state saved to', authFile);
});
