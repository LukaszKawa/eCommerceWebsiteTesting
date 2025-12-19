// spec: specs/test.plan.md
// section: 2.2 Product Discovery - Path B: Browse Category / Featured

import { test, expect } from '../fixtures';

test.describe('Product Discovery', () => {
  test('Browse Category - Navigate to product details from category', async ({
    page,
    homePage,
    productPage,
  }) => {
    // 1. Open home page
    await homePage.goto();

    // 2. Select Phones category
    await homePage.selectCategory('phones');
    await page.waitForTimeout(500);

    // 3. Click first product to open details page
    const firstProduct = await homePage.getFirstProduct();
    await firstProduct.click();
    await page.waitForLoadState('networkidle');

    // 4. Verify we're on product details page
    const url = page.url();
    expect(url).toContain('prod.html');
  });

  test('Product Details - Verify complete product information', async ({
    page,
    homePage,
    productPage,
  }) => {
    // 1. Open home page and navigate to category
    await homePage.goto();
    await homePage.selectCategory('phones');
    await page.waitForTimeout(500);

    // 2. Click first product
    const firstProduct = await homePage.getFirstProduct();
    await firstProduct.click();
    await page.waitForLoadState('networkidle');

    // 3. Verify product page has complete info
    const hasCompleteInfo = await productPage.hasCompleteProductInfo();
    expect(hasCompleteInfo).toBe(true);

    // 4. Verify specific elements
    const title = await productPage.getProductTitle();
    expect(title).toBeTruthy();
    expect(title?.length).toBeGreaterThan(0);

    const price = await productPage.getProductPrice();
    expect(price).toBeTruthy();

    const imageVisible = await productPage.isProductImageVisible();
    expect(imageVisible).toBe(true);

    const addBtnVisible = await productPage.isAddToCartButtonVisible();
    expect(addBtnVisible).toBe(true);
  });

  test('Product Details - Verify product description is present', async ({
    page,
    homePage,
    productPage,
  }) => {
    // 1. Navigate to product details
    await homePage.goto();
    await homePage.selectCategory('laptops');
    await page.waitForTimeout(500);

    // 2. Click first product
    const firstProduct = await homePage.getFirstProduct();
    await firstProduct.click();
    await page.waitForLoadState('networkidle');

    // 3. Verify description exists
    const description = await productPage.getProductDescription();
    expect(description).toBeTruthy();
  });

  test('Product Details - Verify back button navigation', async ({
    page,
    homePage,
    productPage,
  }) => {
    // 1. Navigate to product details
    await homePage.goto();
    await homePage.selectCategory('phones');
    await page.waitForTimeout(500);
    const initialUrl = page.url();

    // 2. Click first product
    const firstProduct = await homePage.getFirstProduct();
    await firstProduct.click();
    await page.waitForLoadState('networkidle');

    // 3. Click back button
    const backBtnVisible = await productPage.backBtn.isVisible().catch(() => false);
    if (backBtnVisible) {
      await productPage.goBack();
      // Verify we're back on previous page
      const finalUrl = page.url();
      expect(finalUrl).toContain('index.html');
    }
  });
});
