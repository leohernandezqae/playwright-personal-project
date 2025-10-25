import { defineConfig, devices } from "@playwright/test";

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./tests/artifacts/test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["Line"],
    ["list"],
    ["html", { outputFolder: "./tests/artifacts/test-report" }]
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    }
  ],
  webServer: {
    command: "npm run start",
    url: process.env.BASE_URL || 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    name: 'Launch project',
    timeout: 30 * 1000,
    stdout: "ignore",
    stderr: "pipe",
  },
  use: {
    baseURL: process.env.BASE_URL,
    trace: "on-first-retry",
    screenshot: "on",
  },
});
