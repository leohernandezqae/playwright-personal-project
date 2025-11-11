import { request } from '@playwright/test';
import fs from 'fs';
import path from 'path';

interface LocalStorageItem {
  name: string;
  value: string;
}

interface AuthFile {
  origins: {
    localStorage: LocalStorageItem[];
  }[];
}

export async function createAuthenticatedContext() {
  const authStatePath = path.join(__dirname, '../../playwright/.auth/user.json');
  const data: AuthFile = JSON.parse(fs.readFileSync(authStatePath, 'utf-8'));
  const token = data.origins[0].localStorage.find(i => i.name === 'token')?.value;

  if (!token) throw new Error('Token not found in auth state file');

  return await request.newContext({
    extraHTTPHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}
