import { test, expect } from "@playwright/test";

// FLOW 1: Signup -> OTP verification -> Onboarding -> Profile -> Home
test("demo signup with OTP leads through onboarding to home", async ({ page }) => {
  await page.goto("/signup");
  await page.getByPlaceholder(/you@example.com/i).fill("test.user@example.com");
  await page.getByRole("button", { name: /send verification code/i }).click();
  await page.getByPlaceholder("123456").fill("123456");
  await page.getByRole("button", { name: /verify & continue/i }).click();

  await expect(page).toHaveURL(/\/onboarding/);
  await page.getByRole("button", { name: /get started/i }).click();
  await page.getByText("Journalist", { exact: true }).click();
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByRole("button", { name: /start verification later/i }).click();

  await expect(page).toHaveURL(/\/home/);
  await expect(page.getByPlaceholder(/share an update/i)).toBeVisible();
});
