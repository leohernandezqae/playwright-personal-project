import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env"), quiet: true });

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./tests/artifacts/test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    ["html", { outputFolder: "./tests/artifacts/test-report" }],
  ],
  projects: [
    {
      name: "setup",
      testDir: "./tests",
      testMatch: "**/*.setup.ts",
    },
    {
      name: "e2e",
      testDir: "./tests/e2e",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "api",
      testDir: "./tests/api",
      dependencies: ["setup"],
    },
  ],
  webServer: {
    command: "npm run start",
    url: process.env.BASE_URL || "http://localhost:3000",
    reuseExistingServer: true,
    name: "Launch project",
    timeout: 120 * 1000,
  },
  use: {
    baseURL: process.env.BASE_URL,
    trace: "on-first-retry",
    screenshot: "on",
  },
});