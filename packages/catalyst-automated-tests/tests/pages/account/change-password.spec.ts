import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import normalizePath from '../../../utils/normalize-path';
import getTranslations from '../../../utils/get-translations';
import createCustomer from '../../../utils/remote/create-customer';
import getCustomer from '../../../utils/remote/get-customer';
import deleteCustomer from '../../../utils/remote/delete-customer';

test.describe.configure({ mode: 'serial' });

test.describe('Change password', () => {
  const testUserEmail = faker.internet.email({ provider: 'test.bigcommerce.com' });
  const testUserPassword = faker.internet.password({ pattern: /[a-zA-Z0-9]/, prefix: 'A1', length: 10 });
  const testUserFirstName = faker.person.firstName();
  const testUserLastName = faker.person.lastName();

  test.beforeEach(async ({ page }) => {
    const t = await getTranslations(page, 'Login.Form');
    const aht = await getTranslations(page, 'Account.Home');
    const ast = await getTranslations(page, 'Account.Settings');

    await createCustomer({
      email: testUserEmail,
      first_name: testUserFirstName,
      last_name: testUserLastName,
      authentication: {
        force_password_reset: false,
        new_password: testUserPassword,
      },
    });

    await page.goto('/login/');

    await page.getByLabel(t('emailLabel')).fill(testUserEmail);
    await page.getByLabel(t('passwordLabel')).fill(testUserPassword);

    const loginButton = page.getByRole('button', { name: t('logIn') });
    await loginButton.click();

    expect(page.waitForURL(normalizePath(page, '/account/')));
    await expect(page.getByRole('heading', { name: aht('heading') })).toBeVisible();

    expect(page.goto(normalizePath(page, '/account/settings/change-password/')));

    await expect(page.getByRole('heading', { name: ast('title') })).toBeVisible();
  });

  test.afterEach(async () => {
    const customer = await getCustomer(testUserEmail);
    await deleteCustomer(customer.id);
  });

  test('should validate password confirmation', async ({ page }) => {
    const t = await getTranslations(page, 'Account.Settings.ChangePassword');

    await page.getByLabel(t('currentPasswordLabel')).fill(testUserPassword);
    await page.getByLabel(t('newPasswordLabel')).fill('password');
    await page.getByLabel(t('confirmPasswordLabel')).fill('another-password');

    await page.getByRole('button', { name: t('submitText') }).click();

    await expect(page.getByText(t('confirmPasswordValidationMessage'))).toBeVisible();
  });

  test('should update password', async ({ page }) => {
    const testUserNewPassword = faker.internet.password({ pattern: /[a-zA-Z0-9]/, prefix: 'A1', length: 10 });

    const t = await getTranslations(page, 'Account.Settings.ChangePassword');
    const lft = await getTranslations(page, 'Login.Form');
    const aht = await getTranslations(page, 'Account.Home');

    await page.getByLabel(t('currentPasswordLabel')).fill(testUserPassword);
    await page.getByLabel(t('newPasswordLabel')).fill(testUserNewPassword);
    await page.getByLabel(t('confirmPasswordLabel')).fill(testUserNewPassword);

    await page.getByRole('button', { name: t('submitText') }).click();

    expect(page.waitForURL(normalizePath(page, '/login/')));
    await expect(page.getByText(t('confirmChangePassword'))).toBeVisible();

    await page.getByLabel(lft('emailLabel')).fill(testUserEmail);
    await page.getByLabel(lft('passwordLabel')).fill(testUserNewPassword);

    const loginButton = page.getByRole('button', { name: lft('logIn') });
    await loginButton.click();

    expect(page.waitForURL(normalizePath(page, '/account/')));
    await expect(page.getByRole('heading', { name: aht('heading') })).toBeVisible();
  });
});
