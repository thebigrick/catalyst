import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import normalizePath from '../../../utils/normalize-path';
import getTranslations from '../../../utils/get-translations';
import createCustomer from '../../../utils/remote/create-customer';
import getCustomer from '../../../utils/remote/get-customer';
import deleteCustomer from '../../../utils/remote/delete-customer';

test.describe.configure({ mode: 'serial' });

const testUserEmail = faker.internet.email({ provider: 'test.bigcommerce.com' });
const testUserPassword = faker.internet.password({ pattern: /[a-zA-Z0-9]/, prefix: 'A1', length: 10 });
const testUserFirstName = faker.person.firstName();
const testUserLastName = faker.person.lastName();

const newFirstName = faker.person.firstName();
const newLastName = faker.person.lastName();
const newEmail = faker.internet.email({ provider: 'test.bigcommerce.com' });

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

  expect(page.goto(normalizePath(page, '/account/settings/')));

  await expect(page.getByRole('heading', { name: ast('title') })).toBeVisible();
});

test.afterEach(async () => {
  const customer = await getCustomer(testUserEmail);
  const newCustomer = await getCustomer(newEmail);

  if (customer) {
    await deleteCustomer(customer.id);
  }

  if (newCustomer) {
    await deleteCustomer(newCustomer.id);
  }
});

test('should display user information', async ({ page }) => {
  await expect(page.locator('[name=address-customer-firstName]')).toHaveValue(testUserFirstName);
  await expect(page.locator('[name=address-customer-lastName]')).toHaveValue(testUserLastName);
  await expect(page.locator('[name=customer-email]')).toHaveValue(testUserEmail);
});

test('should update user information', async ({ page }) => {
  const t = await getTranslations(page, 'Account.Settings');

  await page.locator('[name=address-customer-firstName]').fill(newFirstName);
  await page.locator('[name=address-customer-lastName]').fill(newLastName);
  await page.locator('[name=customer-email]').fill(newEmail);

  await page.getByRole('button', { name: t('submit') }).click();

  await expect(page.getByText(t('successMessage'))).toBeVisible();

  await expect(page.locator('[name=address-customer-firstName]')).toHaveValue(newFirstName);
  await expect(page.locator('[name=address-customer-lastName]')).toHaveValue(newLastName);
  await expect(page.locator('[name=customer-email]')).toHaveValue(newEmail);

  const customer = await getCustomer(newEmail);

  expect(customer).toMatchObject({
    email: newEmail,
    first_name: newFirstName,
    last_name: newLastName,
  });
});
