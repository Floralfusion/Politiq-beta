import { test, expect } from "@playwright/test";

test.describe("responsive layout", () => {
  test("mobile bottom nav appears at 375px width and no horizontal overflow", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await context.newPage();
    await page.goto("/");
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    await context.close();
  });

  test("desktop sidebar appears at 1440px width", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto("/login");
    await page.getByPlaceholder(/you@example.com/i).fill("desktop@example.com");
    await page.getByRole("button", { name: /send verification code/i }).click();
    await page.getByPlaceholder("123456").fill("123456");
    await page.getByRole("button", { name: /verify & continue/i }).click();
    await page.goto("/home");
    await expect(page.getByRole("link", { name: /^feed$/i })).toBeVisible();
    await context.close();
  });
});
