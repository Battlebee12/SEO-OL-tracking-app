const { test, expect } = require('@playwright/test');

test('home page shows both cards and routes work', async ({ page }) => {
  // open the app root
  await page.goto('/');

  // check the card titles exist
  await expect(page.locator('h2', { hasText: "OL SHIFT CHECK IN OUT" })).toBeVisible();
  await expect(page.locator('h2', { hasText: "VIEW PAST SHIFTS" })).toBeVisible();

  // click the shift tracker card
  await page.click('text=OL SHIFT CHECK IN OUT');

  // confirm we landed on /shift (adjust if your router renders differently)
  await expect(page).toHaveURL(/\/shift$/);

  // go back and click the past-shifts card
  await page.goBack();
  await page.click('text=VIEW PAST SHIFTS');
  await expect(page).toHaveURL(/\/pshifts$/);
});
