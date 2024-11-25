import { test, expect, Page } from '@playwright/test';
import { describe } from 'node:test';
import getTranslations from '../../utils/get-translations';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

const openSearchPopup = async (page: Page) => {
  const t = await getTranslations(page, 'Components.SearchForm');
  await page.getByRole('button', { name: t('openSearchPopup') }).click();
}

test('should be closed at page load', async ({ page }) => {
  await expect(page.getByRole('dialog')).toBeVisible({ visible: false });
});

test('should be visible', async ({ page }) => {
  await openSearchPopup(page);
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('should close the search popup', async ({ page }) => {
  const t = await getTranslations(page, 'Components.SearchForm');
  await openSearchPopup(page);

  await page.getByRole('button', { name: t('closeSearchPopup') }).click();
  await expect(page.getByRole('dialog')).toBeVisible({ visible: false });
});

test('should show clear button when input is not empty', async ({ page }) => {
  const t = await getTranslations(page, 'Components.SearchForm');
  await openSearchPopup(page);

  await expect(page.getByRole('button', { name: t('clearSearch') })).toBeVisible({ visible: false });
  await page.getByPlaceholder(t('searchPlaceholder')).type('a');
  await expect(page.getByRole('button', { name: t('clearSearch') })).toBeVisible();
});

test('should clear the input when clear button is clicked', async ({ page }) => {
  const t = await getTranslations(page, 'Components.SearchForm');
  await openSearchPopup(page);

  await page.getByPlaceholder(t('searchPlaceholder')).type('a');
  await page.getByRole('button', { name: t('clearSearch') }).click();
  await expect(page.getByPlaceholder(t('searchPlaceholder'))).toHaveText('');
});

test('should start searching only after 3 characters', async ({ page }) => {
  const t = await getTranslations(page, 'Components.SearchForm');
  await openSearchPopup(page);

  await page.getByPlaceholder(t('searchPlaceholder')).type('a');
  await expect(page.getByText(t('processing'))).toBeVisible({ visible: false });
  await page.getByPlaceholder(t('searchPlaceholder')).type('b');
  await expect(page.getByText(t('processing'))).toBeVisible({ visible: false });
  await page.getByPlaceholder(t('searchPlaceholder')).type('c');
  await expect(page.getByText(t('processing'))).toBeVisible({ visible: true });
});

test('should display empty results message', async ({ page }) => {
  const t = await getTranslations(page, 'Components.SearchForm');
  await openSearchPopup(page);

  await page.getByPlaceholder(t('searchPlaceholder')).type('thisproductdoesnotexist');
  await expect(page.getByText(t('noSearchResults', { term: 'thisproductdoesnotexist' }))).toBeVisible();
});