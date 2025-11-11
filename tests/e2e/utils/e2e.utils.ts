import { Page, TestInfo } from "@playwright/test";

export async function insertScreenShot(page: Page, testInfo: TestInfo) {
    const screenShot = await page.screenshot();
    await testInfo.attach('screenshot', { body: screenShot, contentType: 'image/png' });
}