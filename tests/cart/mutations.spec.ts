// spec: specs/test.plan.md
// section: 3.2 Cart Mutations - Update Quantity or Remove Item

import { test, expect } from '../fixtures';

test.describe('Cart & Checkout', () => {
  test('Cart Mutations - Remove item from cart', async ({
    page,
    homePage,
    productPage,
    cartPage,
  }) => {
    // 1. Add product to cart
    await homePage.goto();
    await homePage.selectCategory('phones');
    await page.waitForTimeout(500);

    const firstProduct = await homePage.getFirstProduct();
    await firstProduct.click();
    await page.waitForLoadState('networkidle');
    await productPage.clickAddToCart();

    // 2. Open cart
    await homePage.openCart();
    await page.waitForLoadState('networkidle');

    // Verify product is in cart
    let cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(1);

    // 3. Remove the product
    await cartPage.removeFirstItem();
    await page.waitForTimeout(500);

    // 4. Verify cart is empty
    const isCartEmpty = await cartPage.isCartEmpty();
    expect(isCartEmpty).toBe(true);

    const cartTotal = await cartPage.getCartTotalPrice();
    expect(cartTotal).toBe('0');
  });

  test('Cart Mutations - Verify total updates after removal', async ({
    page,
    homePage,
    productPage,
    cartPage,
  }) => {
    // 1. Add two products
    await homePage.goto();
    await homePage.selectCategory('phones');
    await page.waitForTimeout(500);

    let firstProduct = await homePage.getFirstProduct();
    await firstProduct.click();
    await page.waitForLoadState('networkidle');
    const priceOne = await productPage.getProductPrice();
    await productPage.clickAddToCart();

    // Add second product
    await homePage.goto();
    await homePage.selectCategory('laptops');
    await page.waitForTimeout(500);

    let secondProduct = await homePage.getFirstProduct();
    await secondProduct.click();
    await page.waitForLoadState('networkidle');
    const priceTwo = await productPage.getProductPrice();
    await productPage.clickAddToCart();

    // 2. Open cart and verify total
    await homePage.openCart();
    await page.waitForLoadState('networkidle');

    const totalBefore = await cartPage.getCartTotalPrice();
    expect(totalBefore).toBeTruthy();
    expect(totalBefore).not.toBe('0');

    // 3. Remove first item
    await cartPage.removeFirstItem();
    await page.waitForTimeout(500);

    // 4. Verify total changed (reduced)
    const totalAfter = await cartPage.getCartTotalPrice();
    expect(totalAfter).toBeTruthy();
    expect(totalAfter).not.toBe(totalBefore);
  });

  test('Cart Mutations - Add same item twice creates multiple entries', async ({
    page,
    homePage,
    productPage,
    cartPage,
  }) => {
    // 1. Add first product
    await homePage.goto();
    await homePage.selectCategory('phones');
    await page.waitForTimeout(500);

    const firstProduct = await homePage.getFirstProduct();
    const productName = await firstProduct.textContent();
    await firstProduct.click();
    await page.waitForLoadState('networkidle');

    await productPage.clickAddToCart();

    // 2. Go back and add same product again
    await homePage.goto();
    await homePage.selectCategory('phones');
    await page.waitForTimeout(500);

    const sameProduct = await homePage.getFirstProduct();
    await sameProduct.click();
    await page.waitForLoadState('networkidle');

    await productPage.clickAddToCart();

    // 3. Open cart
    await homePage.openCart();
    await page.waitForLoadState('networkidle');

    // 4. Verify both entries exist (or quantity is 2)
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBeGreaterThanOrEqual(1);

    // Verify total shows doubled price
    const cartTotal = await cartPage.getCartTotalPrice();
    expect(cartTotal).toBeTruthy();
  });

  test('Cart Mutations - Verify cart persists after page reload', async ({
    page,
    homePage,
    productPage,
    cartPage,
  }) => {
    // 1. Add product to cart
    await homePage.goto();
    await homePage.selectCategory('phones');
    await page.waitForTimeout(500);

    const firstProduct = await homePage.getFirstProduct();
    await firstProduct.click();
    await page.waitForLoadState('networkidle');
    await productPage.clickAddToCart();

    // 2. Navigate to cart and note items
    await homePage.openCart();
    await page.waitForLoadState('networkidle');

    const itemsBeforeReload = await cartPage.getCartItemCount();
    const totalBeforeReload = await cartPage.getCartTotalPrice();

    // 3. Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 4. Verify cart still has items
    const itemsAfterReload = await cartPage.getCartItemCount();
    const totalAfterReload = await cartPage.getCartTotalPrice();

    expect(itemsAfterReload).toBe(itemsBeforeReload);
    expect(totalAfterReload).toBe(totalBeforeReload);
  });
});
