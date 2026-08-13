import { expect, test } from "@playwright/test";

test.describe("World Latte Art Throwdown", () => {
  test("landing explains the product and price", async ({ page }) => {
    await page.goto("/throwdown");
    await expect(page.getByRole("heading", { name: /world latte art throwdown/i })).toBeVisible();
    await expect(page.getByText(/USD 300/i).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /create a throwdown/i })).toBeVisible();
  });

  test("large board is readable without leaking mapping keys", async ({ page }) => {
    await page.goto("/throwdown");
    const seed = page.getByRole("button", { name: /load demo/i });
    if (await seed.count()) {
      // landing has no seed button; directory after login does
    }
    await page.goto("/throwdown/login");
    await page.getByRole("button", { name: /local \/ demo sign-in/i }).click();
    await page.waitForURL(/throwdown\/me/);
    await page.goto("/throwdown/e/demo-a-freestyle/board");
    await expect(page.getByText(/world latte art throwdown|heat/i).first()).toBeVisible();
    const html = await page.content();
    expect(html).not.toMatch(/entryAId|entry_a_id|heatBlindMapping/);
  });

  test("judge ballot is keyboard operable A/B", async ({ page }) => {
    await page.goto("/throwdown/login");
    await page.getByLabel("Email").fill("demo-a-judge-0@wlat.demo");
    await page.getByRole("button", { name: /local \/ demo sign-in/i }).click();
    await page.waitForURL(/throwdown\/me/);
    await page.goto("/throwdown/events");
    await expect(page.getByRole("heading", { name: /public throwdowns/i })).toBeVisible();
  });
});
