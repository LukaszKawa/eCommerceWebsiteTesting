// spec: specs/test.plan.md
// section: 3.1 Add To Cart - From Product Page

import { test, expect } from '../fixtures';

test.describe('Cart & Checkout', () => {
  test.beforeEach(async ({ homePage }) => {
    // Navigate to home page before each test
    await homePage.goto();
  });

  test('Add to Cart - Add product from category listing', async ({
    page,
    homePage,
    productPage,
    cartPage,
  }) => {
    // 1. Select category
    await homePage.selectCategory('phones');
    await page.waitForTimeout(500);

    // 3. Click first product to open details
    const firstProduct = await homePage.getFirstProduct();
    const productName = await firstProduct.textContent();
    await firstProduct.click();
    await page.waitForTimeout(1500);

    // 4. Click Add to Cart button
    const alertMessage = await productPage.clickAddToCart();
    expect(alertMessage).toBeTruthy();
    expect(alertMessage?.toLowerCase()).toContain('added');

    // 5. Navigate to cart
    await homePage.openCart();
    await page.waitForTimeout(1500);

    // 6. Verify product is in cart
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBeGreaterThan(0);

    const firstItemName = await cartPage.getFirstItemName();
    expect(firstItemName).toBeTruthy();

    const firstItemPrice = await cartPage.getFirstItemPrice();
    expect(firstItemPrice).toBeTruthy();
  });

  test('Add to Cart - Verify cart total updates', async ({
    page,
    homePage,
    productPage,
    cartPage,
  }) => {
    // 1. Add product from category
    await homePage.selectCategory('phones');
    await page.waitForTimeout(500);

    const firstProduct = await homePage.getFirstProduct();
    await firstProduct.click();
    await page.waitForTimeout(1500);

    // Get product price from details page
    const productPrice = await productPage.getProductPrice();

    // Add to cart
    await productPage.clickAddToCart();

    // 2. Navigate to cart
    await homePage.openCart();
    await page.waitForTimeout(1500);

    // 3. Verify total
    const cartTotal = await cartPage.getCartTotalPrice();
    expect(cartTotal).toBeTruthy();
    expect(cartTotal).not.toBe('0');
  });

  test('Add to Cart - Multiple products', async ({
    page,
    homePage,
    productPage,
    cartPage,
  }) => {
    // 1. Add first product
    await homePage.selectCategory('phones');
    await page.waitForTimeout(500);

    let firstProduct = await homePage.getFirstProduct();
    await firstProduct.click();
    await page.waitForTimeout(1500);
    await productPage.clickAddToCart();

    // 2. Add second product from different category
    await homePage.goto();
    await homePage.selectCategory('laptops');
    await page.waitForTimeout(500);

    let secondProduct = await homePage.getFirstProduct();
    await secondProduct.click();
    await page.waitForTimeout(1500);
    await productPage.clickAddToCart();

    // 3. Open cart and verify both items
    await homePage.openCart();
    await page.waitForTimeout(1500);

    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(2);
  });
});
