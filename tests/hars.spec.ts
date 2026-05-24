import { test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

const refreshToken =
  '14b5d9f9f1769dfc32c917f5b2aad883541f9b3b291b73655abded13c2aa27c99ca98aa458068d14';

const accessToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Zjc0MWE5YTY0MTc3MDAxYjMzNDc1OSIsImlhdCI6MTc3OTYxNTAzOSwiZXhwIjoxNzc5NjE2MjM5fQ.3MqNRu0JUigfpbnJbx7zzSpHRQjc--0dJyFjcz5yDSM';

async function authorize(page: any) {
  await page.addInitScript((token: string) => {
    localStorage.setItem('refreshToken', token);
  }, refreshToken);

  await page.context().addCookies([
    {
      name: 'accessToken',
      value: accessToken,
      domain: 'localhost',
      path: '/'
    }
  ]);
}

test('записать user.har', async ({ page }) => {
  await page.routeFromHAR('./tests/hars/user.har', {
    url: '**/api/auth/user',
    update: true
  });

  await authorize(page);

  const userResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/auth/user') &&
      response.request().method() === 'GET'
  );

  await page.goto('/');

  await userResponse;

  await page.waitForLoadState('networkidle');
});

test('записать orders.har', async ({ page }) => {
  await page.routeFromHAR('./tests/hars/orders.har', {
    url: '**/api/orders',
    update: true
  });

  await authorize(page);

  await page.goto('/');

  await page
    .locator('li')
    .filter({ hasText: 'Флюоресцентная булка' })
    .getByRole('button', { name: /добавить/i })
    .click();

  await page
    .locator('li')
    .filter({ hasText: 'Биокотлета' })
    .getByRole('button', { name: /добавить/i })
    .click();

  const postOrderResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/orders') &&
      response.request().method() === 'POST'
  );

  const getOrdersResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/orders') &&
      response.request().method() === 'GET'
  );

  await page.getByRole('button', { name: /оформить заказ/i }).click();

  await postOrderResponse;

  await getOrdersResponse.catch(() => null);

  await page.waitForLoadState('networkidle');
});
