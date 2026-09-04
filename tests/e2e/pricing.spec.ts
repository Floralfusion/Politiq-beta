import { test, expect } from "@playwright/test";

test("pricing page shows POLITIQ Verified at the configured price", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByRole("heading", { name: /politiq verified/i })).toBeVisible();
  await expect(page.getByText("₹999")).toBeVisible();
  await expect(page.getByRole("button", { name: /subscribe with cashfree/i })).toBeVisible();
});
