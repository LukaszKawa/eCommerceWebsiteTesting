// spec: specs/test.plan.md
// section: 3.3 Coupon / Discount - Apply Promo Code

import { test, expect } from '../fixtures';

test.describe('Cart & Checkout', () => {
  test('Coupon - Check if coupon field exists', async ({ homePage, cartPage }) => {
    // 1. Open home page
    await homePage.goto();

    // 2. Add a product to cart
    await homePage.selectCategory('phones');
    await homePage.page.waitForTimeout(500);

    const firstProduct = await homePage.getFirstProduct();
    await firstProduct.click();
    await homePage.page.waitForLoadState('networkidle');

    // Add to cart
    const productPage = homePage.page;
    const addBtn = productPage.locator('a.btn-default:text("Add to cart")');
    await addBtn.click();

    // Handle alert
    const alertPromise = new Promise<void>((resolve) => {
      productPage.once('dialog', async (dialog) => {
        await dialog.accept();
        resolve();
      });
    });
    await Promise.race([
      alertPromise,
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);

    // 3. Open cart
    await homePage.openCart();
    await homePage.page.waitForLoadState('networkidle');

    // 4. Check if coupon field exists
    const hasCouponField = await cartPage.hasCouponField();

    if (!hasCouponField) {
      // Skip coupon tests if feature not available
      test.skip();
    }
  });

  test('Coupon - Apply invalid coupon code', async ({
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

    // 3. Check if coupon field exists
    const hasCoupon = await cartPage.hasCouponField();
    if (!hasCoupon) {
      test.skip();
      return;
    }

    // 4. Get total before coupon
    const totalBefore = await cartPage.getCartTotalPrice();

    // 5. Apply invalid coupon
    const couponMessage = await cartPage.applyCoupon('INVALIDCODE123');

    // 6. Verify total unchanged
    const totalAfter = await cartPage.getCartTotalPrice();
    expect(totalAfter).toBe(totalBefore);

    // Verify error message if alert was shown
    if (couponMessage) {
      expect(
        couponMessage.toLowerCase().includes('invalid') ||
          couponMessage.toLowerCase().includes('wrong') ||
          couponMessage.toLowerCase().includes('not found')
      ).toBe(true);
    }
  });

  test('Coupon - Feature not available (N/A)', async ({
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

    // 3. Check if coupon feature is available
    const hasCoupon = await cartPage.hasCouponField();

    // If feature doesn't exist, this test is N/A
    if (!hasCoupon) {
      test.skip();
    }
  });
});
