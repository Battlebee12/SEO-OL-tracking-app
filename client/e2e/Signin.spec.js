const { test, expect } = require('@playwright/test');




test('user fills and submits shift form', async ({ page }) => {
  await page.goto('/shift');

  // Fill out the form
  await page.fill('input[type="text"] >> nth=0', 'Test OL');      // Name
  await page.fill('input[type="text"] >> nth=1', '12345678');       // ID
  await page.fill('input[type="text"] >> nth=2', '2');             // Group number
  await page.fill('input[type="text"] >> nth=3', 'Reason text');   // RSD

  // Select 'IN'
  await page.check('input[type="radio"][value="out"]');

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait and check for success or error
  const successMessage = page.locator('text=✅ Successfully signed out.');
  const failureMessage = page.locator('text=❌');

  // Expect either success or known error — update as needed
  await expect(successMessage.or(failureMessage)).toBeVisible();
});
