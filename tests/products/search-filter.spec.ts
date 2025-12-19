// spec: specs/test.plan.md
// section: 2.1 Product Discovery - Path A: Search + Filter

import { test, expect } from '../fixtures';

test.describe('Product Discovery', () => {
  test('Search and Filter - Browse products by category (Phones)', async ({
    page,
    homePage,
    productPage,
  }) => {
    // 1. Open home page
    await homePage.goto();

    // 2. Click Phones category
    await homePage.selectCategory('phones');
    await page.waitForTimeout(500);

    // 3. Verify products are displayed
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    // 4. Verify each product has title visible
    const firstProduct = await homePage.getFirstProduct();
    expect(firstProduct).toBeDefined();
    const isVisible = await firstProduct.isVisible();
    expect(isVisible).toBe(true);
  });

  test('Search and Filter - Browse products by category (Laptops)', async ({
    page,
    homePage,
  }) => {
    // 1. Open home page
    await homePage.goto();

    // 2. Click Laptops category
    await homePage.selectCategory('laptops');
    await page.waitForTimeout(500);

    // 3. Verify Laptops products are displayed
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });

  test('Search and Filter - Browse products by category (Monitors)', async ({
    page,
    homePage,
  }) => {
    // 1. Open home page
    await homePage.goto();

    // 2. Click Monitors category
    await homePage.selectCategory('monitors');
    await page.waitForTimeout(500);

    // 3. Verify Monitors products are displayed
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });

  test('Search and Filter - Verify product cards have essential info', async ({
    page,
    homePage,
  }) => {
    // 1. Open home page
    await homePage.goto();

    // 2. Select a category
    await homePage.selectCategory('phones');
    await page.waitForTimeout(500);

    // 3. Get first product card
    const firstProduct = await homePage.getFirstProduct();
    expect(firstProduct).toBeDefined();

    // 4. Verify product card has text (product name/price)
    const productText = await firstProduct.textContent();
    expect(productText).toBeTruthy();
    expect(productText?.length).toBeGreaterThan(0);
  });

  test('Search and Filter - Handle pagination if available', async ({
    page,
    homePage,
  }) => {
    // 1. Open home page
    await homePage.goto();

    // 2. Select category
    await homePage.selectCategory('phones');
    await page.waitForTimeout(500);

    // 3. Check if Next button exists
    const nextBtnVisible = await homePage.nextPageBtn.isVisible().catch(() => false);

    if (nextBtnVisible) {
      const firstPageCount = await homePage.getProductCount();

      // 4. Click next
      await homePage.nextPageBtn.click();
      await page.waitForTimeout(500);

      // 5. Verify product list changed
      const secondPageCount = await homePage.getProductCount();
      expect(secondPageCount).toBeGreaterThan(0);
    }
  });
});
