import { test, expect } from "@playwright/test";

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByPlaceholder(/you@example.com/i).fill("payer@example.com");
  await page.getByRole("button", { name: /send verification code/i }).click();
  await page.getByPlaceholder("123456").fill("123456");
  await page.getByRole("button", { name: /verify & continue/i }).click();
}

// FLOW 4: Request Contact -> Approval already granted in seed data -> Payment -> Unlock
test("pay to unlock an approved contact request", async ({ page }) => {
  await signIn(page);
  await page.goto("/contact-requests");
  await page.getByRole("tab", { name: /outgoing/i }).click().catch(() => {});
  await page.getByText(/outgoing/i).first().click();

  const payButton = page.getByRole("button", { name: /pay ₹/i }).first();
  await expect(payButton).toBeVisible();
  await payButton.click();

  await page.getByRole("button", { name: /^pay ₹/i }).click();
  await expect(page.getByText(/payment confirmed/i)).toBeVisible({ timeout: 5000 });
});
