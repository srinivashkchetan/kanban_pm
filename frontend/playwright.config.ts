import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:3000",
    browserName: "chromium",
    headless: true,
  },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    timeout: 60_000,
    reuseExistingServer: !process.env.CI,
  },
};

export default config;

