import { test, expect, Page } from '@playwright/test';
import getTranslations from '../../utils/get-translations';
import getNavCategories from '../../utils/remote/get-nav-categories';
import searchProducts from '../../utils/remote/search-products';

test.describe.configure({ mode: 'parallel' });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

const openSearchPopup = async (page: Page) => {
  const t = await getTranslations(page, 'Components.SearchForm');
  await page.getByRole('button', { name: t('openSearchPopup'), exact: true }).click();
}

test.describe('Searchbar closed', () => {
  test('should be closed at page load', async ({ page }) => {
    await expect(page.getByRole('dialog')).toBeVisible({ visible: false });
  });

  test('should open when clicked', async ({ page }) => {
    await openSearchPopup(page);
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});

test.describe('Searchbar open', () => {
  test.beforeEach(async ({ page }) => {
    await openSearchPopup(page);
  })

  test('should close the search popup', async ({ page }) => {
    const t = await getTranslations(page, 'Components.SearchForm');

    await page.getByRole('button', { name: t('closeSearchPopup'), exact: true }).click();
    await expect(page.getByRole('dialog')).toBeVisible({ visible: false });
  });

  test('should show clear button when input is not empty', async ({ page }) => {
    const t = await getTranslations(page, 'Components.SearchForm');

    await expect(page.getByRole('button', { name: t('clearSearch'), exact: true })).toBeVisible({ visible: false });
    await page.getByPlaceholder(t('searchPlaceholder')).type('a');
    await expect(page.getByRole('button', { name: t('clearSearch'), exact: true })).toBeVisible();
  });

  test('should clear the input when clear button is clicked', async ({ page }) => {
    const t = await getTranslations(page, 'Components.SearchForm');

    await page.getByPlaceholder(t('searchPlaceholder')).type('a');
    await page.getByRole('button', { name: t('clearSearch') }).click();
    await expect(page.getByPlaceholder(t('searchPlaceholder'))).toHaveText('');
  });

  test('should start searching only after 3 characters', async ({ page }) => {
    const t = await getTranslations(page, 'Components.SearchForm');

    await page.getByPlaceholder(t('searchPlaceholder')).type('a');
    await expect(page.getByText(t('processing'))).toBeVisible({ visible: false });
    await page.getByPlaceholder(t('searchPlaceholder')).type('b');
    await expect(page.getByText(t('processing'))).toBeVisible({ visible: false });
    await page.getByPlaceholder(t('searchPlaceholder')).type('c');
    await expect(page.getByText(t('processing'))).toBeVisible({ visible: true });
  });

  test('should display empty results message', async ({ page }) => {
    const t = await getTranslations(page, 'Components.SearchForm');

    await page.getByPlaceholder(t('searchPlaceholder')).type('thisproductdoesnotexist');
    await expect(page.getByText(t('noSearchResults', { term: 'thisproductdoesnotexist' }))).toBeVisible();
  });

  test('should search products', async ({ page }) => {
    const t = await getTranslations(page, 'Components.SearchForm');
    const products = (await searchProducts(page, { price: { minPrice: -1 } })).slice(0, 5);

    for (const product of products) {
      await page.getByPlaceholder('Search').type(product.name);

      const searchPopup = await page.getByRole('dialog');
      const productLink = await searchPopup
        .getByRole('link', { name: product.name })
        .filter(`[href="${product.path}"]`);

      await expect(productLink).toBeVisible();
      await page.getByRole('button', { name: t('clearSearch') }).click();
    }
  });

  test('should display all the categories of a product', async ({ page }) => {
    const t = await getTranslations(page, 'Components.SearchForm');

    const navCategories = await getNavCategories(page);
    const nonEmptyCategories = navCategories.filter((category) => category.productCount > 0);

    for (const nonEmptyCategory of nonEmptyCategories) {
      const products = await searchProducts(page, { categoryEntityId: nonEmptyCategory.entityId });

      const firstProduct = products[0];
      const productCategories = firstProduct.categories.edges.map(({ node }) => node);

      await page.getByPlaceholder('Search').type(firstProduct.name);

      const searchPopup = await page.getByRole('dialog');
      for (const productCategory of productCategories) {
        const categoryLink = await searchPopup
          .getByRole('link', { name: productCategory.name, exact: true })
          .filter(`[href="${productCategory.path}"]`);

        await expect(categoryLink).toBeVisible();
      }

      await page.getByRole('button', { name: t('clearSearch') }).click();
    }
  });
});