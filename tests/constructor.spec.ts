import { test, expect } from '@playwright/test';
import ingredients from './fixtures/ingredients.json';

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/ingredients', async (route) => {
      console.log('MOCK OK');

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ingredients)
      });
    });

    await page.goto('/');
  });

  test('должен отображать список ингредиентов', async ({ page }) => {
    await expect(page.getByText('Флюоресцентная булка')).toBeVisible();

    await expect(page.getByText('Биокотлета')).toBeVisible();
  });

  test('должен добавлять булку в конструктор', async ({ page }) => {
    const bunCard = page
      .locator('li')
      .filter({ hasText: 'Флюоресцентная булка' });

    await bunCard.getByRole('button', { name: /добавить/i }).click();

    const constructor = page.getByTestId('burger-constructor');

    await expect(constructor).toContainText(
      'Флюоресцентная булка R2-D3 (верх)'
    );

    await expect(constructor).toContainText('Флюоресцентная булка R2-D3 (низ)');
  });

  test('должен добавлять начинку в конструктор', async ({ page }) => {
    const mainCard = page.locator('li').filter({ hasText: 'Биокотлета' });

    await mainCard.getByRole('button', { name: /добавить/i }).click();

    await expect(page.getByTestId('burger-constructor')).toContainText(
      'Биокотлета'
    );
  });
});

test.describe('Модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/ingredients', async (route) => {
      console.log('MOCK OK');

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ingredients)
      });
    });

    await page.goto('/');
  });

  test('должен открывать модальное окно ингредиента', async ({ page }) => {
    const ingredients = page.getByTestId('burger-ingredients');

    const ingredient = ingredients
      .locator('li')
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
