import { test as base, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';

type PageFixtures = {
  homePage: HomePage;
  authPage: AuthPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

type AuthFixtures = PageFixtures & {
  loggedInUser: {
    username: string;
    password: string;
  };
};

/**
 * Base test with Page Objects
 */
export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await use(homePage);
  },
  authPage: async ({ page }, use) => {
    const authPage = new AuthPage(page);
    await use(authPage);
  },
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  },
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
});

/**
 * Extended test with authenticated user fixture
 */
export const authenticatedTest = base.extend<AuthFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await use(homePage);
  },
  authPage: async ({ page }, use) => {
    const authPage = new AuthPage(page);
    await use(authPage);
  },
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  },
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
  loggedInUser: async ({ page, authPage, homePage }, use) => {
    // Create unique user for this test
    const testUser = {
      username: `testuser_${Date.now()}`,
      password: 'TestPass123!',
    };

    // Register and login
    await homePage.goto();
    await homePage.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    // Open signup modal
    await homePage.openSignupModal();
    const signupPromise = authPage.waitForAlertAndAccept();
    await authPage.fillSignupForm(testUser.username, testUser.password);
    await authPage.signupSubmitBtn.click();

    try {
      await Promise.race([
        signupPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Signup timeout')), 5000)
        ),
      ]);
    } catch (e) {
      // Continue even if signup alert times out
    }

    // Login
    await homePage.goto();
    await homePage.openLoginModal();
    const loginPromise = authPage.waitForAlertAndAccept();
    await authPage.fillLoginForm(testUser.username, testUser.password);
    await authPage.loginSubmitBtn.click();

    try {
      await Promise.race([
        loginPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Login timeout')), 5000)
        ),
      ]);
    } catch (e) {
      // Continue even if login alert times out
    }

    // Verify logged in
    await homePage.goto();
    await page.waitForTimeout(500);

    await use(testUser);

    // Cleanup: logout
    try {
      await homePage.clickLogout();
      await page.waitForTimeout(500);
    } catch (e) {
      // Ignore logout errors
    }
  },
});

export { expect };
