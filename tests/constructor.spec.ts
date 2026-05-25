import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await page.goto('/');
});

test.describe('Конструктор бургера', () => {
  test('должен отображать список ингредиентов', async ({ page }) => {
    await expect(page.getByText('Флюоресцентная булка')).toBeVisible();

    await expect(page.getByText('Биокотлета')).toBeVisible();
  });

  test('должен добавлять булку в конструктор', async ({ page }) => {
    const bunCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: 'Флюоресцентная булка' });

    await bunCard.getByRole('button', { name: /добавить/i }).click();

    const constructor = page.getByTestId('burger-constructor');

    await expect(constructor).toContainText(
      'Флюоресцентная булка R2-D3 (верх)'
    );

    await expect(constructor).toContainText('Флюоресцентная булка R2-D3 (низ)');
  });

  test('должен добавлять начинку в конструктор', async ({ page }) => {
    const mainCard = page
      .getByTestId('ingredient-card')
      .filter({ hasText: 'Биокотлета' });

    await mainCard.getByRole('button', { name: /добавить/i }).click();

    await expect(page.getByTestId('burger-constructor')).toContainText(
      'Биокотлета'
    );
  });
});

test.describe('Модальное окно ингредиента', () => {
  test('должен открывать модальное окно ингредиента', async ({ page }) => {
    const ingredients = page.getByTestId('burger-ingredients');

    const ingredient = ingredients
      .getByTestId('ingredient-card')
      .filter({ hasText: 'Краторная булка' });

    await ingredient.click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Детали ингредиента');
    await expect(modal).toContainText('Краторная булка');
  });

  test('должен закрывать модальное окно по клику на крестик', async ({
    page
  }) => {
    await page.getByText('Краторная булка').click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();

    await page.getByTestId('modal-close').click();

    await expect(modal).not.toBeVisible();
  });

  test('должен закрывать модальное окно по клику на overlay', async ({
    page
  }) => {
    await page.getByText('Флюоресцентная булка').click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();

    await page.getByTestId('modal-overlay').click({
      position: { x: 0, y: 0 }
    });

    await expect(modal).not.toBeVisible();
  });
});

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.routeFromHAR('./tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false
    });

    await page.routeFromHAR('./tests/hars/orders.har', {
      url: '**/api/orders',
      update: false
    });

    await page.goto('/');
  });

  test.afterEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  test('должен создавать заказ и очищать конструктор', async ({ page }) => {
    await page
      .getByTestId('ingredient-card')
      .filter({ hasText: 'Флюоресцентная булка' })
      .getByRole('button', { name: /добавить/i })
      .click();

    await page
      .getByTestId('ingredient-card')
      .filter({ hasText: 'Биокотлета' })
      .getByRole('button', { name: /добавить/i })
      .click();

    await page.getByRole('button', { name: /оформить заказ/i }).click();

    const orderModal = page.getByTestId('modal');

    await expect(orderModal).toBeVisible();

    await expect(orderModal).toContainText('105640');

    await page.getByTestId('modal-close').click();

    await expect(orderModal).not.toBeVisible();

    const constructor = page.getByTestId('burger-constructor');

    await expect(constructor).toContainText('Выберите булки');

    await expect(constructor).toContainText('Выберите начинку');
  });
});
