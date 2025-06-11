import { test, expect } from '@playwright/test';

test.describe('Degen Terminal E2E', () => {
  test('should load the tokens list and paginate (English)', async ({ page }) => {
    await page.goto('/tokens/1');
    await expect(page.getByText(/hang tight|loading|coins are being loaded/i)).not.toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/^coin$/i)).toBeVisible({ timeout: 10000 });
    const anyRow = page.locator('tbody tr').first();
    await expect(anyRow).toBeVisible();
    await page.getByRole('button', { name: /go to next page/i }).click();
    await expect(page).toHaveURL(/tokens\/2/);
    await page.getByRole('button', { name: /go to previous page/i }).click();
    await expect(page).toHaveURL(/tokens\/1/);
  });

  test('should load the tokens list and paginate (Polish)', async ({ page }) => {
    await page.goto('/tokens/1');
    await page.getByRole('combobox').selectOption('pl');
    // Wait for full reload and Polish header
    await expect(page.getByText(/^moneta$/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/ładowanie|oczekiwanie|loading/i)).not.toBeVisible({ timeout: 10000 });

    // Re-find the button after reload (this ensures you're clicking the fresh one)
    await page.waitForTimeout(500); // Small delay in case of hydration, adjust if needed
    const nextButton = await page.getByRole('button', { name: /przejdź do następnej strony/i });
    await expect(nextButton).toBeVisible({ timeout: 10000 });
    await expect(nextButton).toBeEnabled({ timeout: 10000 });
    await nextButton.click();

    // Wait for new header and url
    await expect(page.getByText(/^moneta$/i)).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/tokens\/2/);

    // Repeat for previous button
    const prevButton = await page.getByRole('button', { name: /przejdź do poprzedniej strony/i });
    await expect(prevButton).toBeVisible({ timeout: 10000 });
    await expect(prevButton).toBeEnabled({ timeout: 10000 });
    await prevButton.click();
    await expect(page.getByText(/^moneta$/i)).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/tokens\/1/);
  });

  test('should display error state for an invalid token', async ({ page }) => {
    await page.goto('/token/fake-token-does-not-exist');
    await expect(page.locator('body')).toContainText(/404|not found|no data|error|failed|nie udało się załadować|wystąpił błąd/i, { timeout: 10000 });
  });

  // Print debug output on failure for easy investigation
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(await page.content());
    }
  });
});
