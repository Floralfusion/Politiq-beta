import { test, expect } from "@playwright/test";

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByPlaceholder(/you@example.com/i).fill("returning.user@example.com");
  await page.getByRole("button", { name: /send verification code/i }).click();
  await page.getByPlaceholder("123456").fill("123456");
  await page.getByRole("button", { name: /verify & continue/i }).click();
}

// FLOW 2: Discover -> Search -> View profile -> Follow -> Connect
test("discover a profile and send a connection request", async ({ page }) => {
  await signIn(page);
  await page.goto("/discover");
  await expect(page.getByRole("heading", { name: /find the right person/i })).toBeVisible();

  await page.getByPlaceholder(/search people, organisations or expertise/i).fill("Meera");
  await page.waitForTimeout(500);
  await expect(page.getByText("Meera Iyer")).toBeVisible();

  await page.getByRole("link", { name: /meera iyer/i }).first().click();
  await expect(page).toHaveURL(/\/profile\//);
});
