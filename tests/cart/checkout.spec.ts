// spec: specs/test.plan.md
// section: Full Checkout Flow

import { test, expect } from '../fixtures';

test.describe('Cart & Checkout', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('Checkout - Complete purchase flow', async ({
    page,
    homePage,
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    // 1. Add product to cart
    await homePage.selectCategory('phones');
    await page.waitForTimeout(500);

    const firstProduct = await homePage.getFirstProduct();
    await firstProduct.click();
    await page.waitForTimeout(1500);
    await productPage.clickAddToCart();

    // 2. Open cart
    await homePage.openCart();
    await page.waitForTimeout(1000);

    const itemsInCart = await cartPage.getCartItemCount();
    expect(itemsInCart).toBeGreaterThan(0);

    const cartTotal = await cartPage.getCartTotalPrice();
    expect(cartTotal).not.toBe('0');

    // 3. Click Place Order
    await cartPage.clickPlaceOrder();
    await page.waitForTimeout(500);

    const isCheckoutVisible = await checkoutPage.isCheckoutModalVisible();
    expect(isCheckoutVisible).toBe(true);

    // 4. Fill checkout form
    const orderData = {
      name: 'John Doe',
      country: 'USA',
      city: 'New York',
      card: '4111111111111111',
      month: '12',
      year: '2025',
    };

    await checkoutPage.fillCheckoutForm(
      orderData.name,
      orderData.country,
      orderData.city,
      orderData.card,
      orderData.month,
      orderData.year
    );

    // 5. Click Purchase
    await checkoutPage.clickPurchase();
    await page.waitForTimeout(1000);

    // 6. Verify confirmation
    const confirmation = await checkoutPage.getConfirmationMessage();
    expect(confirmation).toBeTruthy();
    expect(confirmation).toContain('Thank you');

    // 7. Get order ID if available
    const orderId = await checkoutPage.getOrderId();
    if (orderId) {
      expect(orderId).toBeTruthy();
    }

    // 8. Close confirmation
    await checkoutPage.closeConfirmationModal();
    await page.waitForTimeout(500);

    // 9. Verify cart is cleared
    await homePage.openCart();
    await page.waitForTimeout(1500);
    const itemsAfterPurchase = await cartPage.getCartItemCount();
    expect(itemsAfterPurchase).toBe(0);
  });

  test('Checkout - Empty form validation', async ({
    page,
    homePage,
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    // 1. Add product
    await homePage.selectCategory('phones');
    await page.waitForTimeout(500);

    const firstProduct = await homePage.getFirstProduct();
    await firstProduct.click();
    await page.waitForTimeout(1500);
    await productPage.clickAddToCart();

    // 2. Open cart and place order
    await homePage.openCart();
    await page.waitForTimeout(1000);
    await cartPage.clickPlaceOrder();
    await page.waitForTimeout(500);

    const isCheckoutVisible = await checkoutPage.isCheckoutModalVisible();
    expect(isCheckoutVisible).toBe(true);

    // 3. Try to purchase without filling form
    let alertMessage = '';
    page.once('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await checkoutPage.clickPurchase();
    await page.waitForTimeout(1000);

    // 4. Verify error or modal remains open
    const stillVisible = await checkoutPage.isCheckoutModalVisible();
    expect(alertMessage !== '' || stillVisible).toBe(true);
  });

  test('Checkout - Partial form completion validation', async ({
    page,
    homePage,
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    // 1. Add product
    await homePage.selectCategory('phones');
    await page.waitForTimeout(500);

    const firstProduct = await homePage.getFirstProduct();
    await firstProduct.click();
    await page.waitForTimeout(1500);
    await productPage.clickAddToCart();

    // 2. Open cart and checkout
    await homePage.openCart();
    await page.waitForTimeout(1000);
    await cartPage.clickPlaceOrder();
    await page.waitForTimeout(500);

    // 3. Fill only name field
    await checkoutPage.nameInput.fill('John Doe');

    // 4. Try to purchase
    let alertMessage = '';
    page.once('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await checkoutPage.clickPurchase();
    await page.waitForTimeout(1000);

    // 5. Verify validation
    const stillVisible = await checkoutPage.isCheckoutModalVisible();
    expect(alertMessage !== '' || stillVisible).toBe(true);
  });
});
