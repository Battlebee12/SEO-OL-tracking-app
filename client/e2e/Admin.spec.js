const { test, expect } = require('@playwright/test');

test('admin dashboard search returns results', async ({ page }) => {
  await page.goto('/pshifts');

  // Fill in the OL student ID field
  await page.getByLabel('OL Student ID').fill('12345678');


  // Click Search
  await page.click('text=Search');

  // Wait for results
  await expect(page.getByRole('table')).toBeVisible();

  // Assert at least one result row appears
  const rows = page.locator('table tbody tr');
  await expect(rows).toHaveCount(1);


  // Optional: check that the student ID appears in the first row
  const firstRowText = await rows.first().innerText();
  expect(firstRowText).toContain('1234567');
});
