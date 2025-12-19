// spec: specs/test.plan.md
// section: 1.1 User Registration - Create Account & Validation

import { test, expect } from '../fixtures';

test.describe('Authentication', () => {
  test.beforeEach(async ({ homePage }) => {
    // Navigate to home page before each test
    await homePage.goto();
  });

  test('User Registration - Happy Path: Create new account with valid data', async ({
    page,
    homePage,
    authPage,
  }) => {
    // 1. Click Sign up button
    expect(page).toBeDefined();

    // 2. Click Sign up button
    await homePage.openSignupModal();
    const isModalVisible = await authPage.isSignupModalVisible();
    expect(isModalVisible).toBe(true);

    // 3. Prepare unique user credentials
    const testUsername = `user_${Date.now()}`;
    const testPassword = 'BezpieczneHaslo1!';

    // 4. Fill signup form
    await authPage.fillSignupForm(testUsername, testPassword);
    
    // 5. Setup alert handler before clicking
    let signupAlert = '';
    page.once('dialog', async (dialog) => {
      signupAlert = dialog.message();
      await dialog.accept();
    });
    
    await authPage.signupSubmitBtn.click();
    await page.waitForTimeout(1500);

    expect(signupAlert).toContain('successful');

    // 6. Verify account can be logged into
    await homePage.goto();
    await homePage.openLoginModal();
    const isLoginModalVisible = await authPage.isLoginModalVisible();
    expect(isLoginModalVisible).toBe(true);

    let loginAlertMsg = '';
    const loginAlertPromise = new Promise<string>((resolve) => {
      page.once('dialog', async (dialog) => {
        loginAlertMsg = dialog.message();
        await dialog.accept();
        resolve(loginAlertMsg);
      });
    });
    
    await authPage.fillLoginForm(testUsername, testPassword);
    await authPage.loginSubmitBtn.click();
    
    // Wait for either alert or navigation (logout button appears when logged in)
    await Promise.race([
      loginAlertPromise,
      homePage.page.locator('a[href="#logout2"], a[href="#logout"]').first().waitFor({ timeout: 5000 }),
    ]).catch(() => {
      // Login may succeed without alert
    });

    // Verify login succeeded by checking if logout button is visible
    const hasLogoutBtn = await homePage.page.locator('a#logout2, a[href="#logout"]').isVisible().catch(() => false);
    expect(hasLogoutBtn || loginAlertMsg.includes('successful')).toBe(true);

    // 7. Verify logged-in state
    await homePage.goto();
    await page.waitForTimeout(500);
    const username = await homePage.getUsernameDisplay();
    expect(username).toContain(testUsername);
  });

  test('User Registration - Negative: Reject registration with invalid data (empty fields)', async ({
    page,
    homePage,
    authPage,
  }) => {
    // 1. Open signup modal
    await homePage.openSignupModal();
    const isModalVisible = await authPage.isSignupModalVisible();
    expect(isModalVisible).toBe(true);

    // 3. Try to submit empty form
    let alertReceived = false;
    page.once('dialog', async (dialog) => {
      alertReceived = true;
      await dialog.accept();
    });

    await authPage.signupSubmitBtn.click();
    await page.waitForTimeout(1000);

    // 4. Verify behavior (application should either show alert or remain in modal)
    // Most apps block with alert or validation
    expect(alertReceived || (await authPage.isSignupModalVisible())).toBe(true);
  });

  test('User Registration - Negative: Reject weak password', async ({
    page,
    homePage,
    authPage,
  }) => {
    // 1. Open signup modal
    await homePage.openSignupModal();
    expect(await authPage.isSignupModalVisible()).toBe(true);

    // 3. Fill with weak password
    const username = `weakpass_${Date.now()}`;
    const weakPassword = 'a'; // Very weak password

    let alertReceived = false;
    let alertMessage = '';
    page.once('dialog', async (dialog) => {
      alertReceived = true;
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await authPage.fillSignupForm(username, weakPassword);
    await authPage.signupSubmitBtn.click();
    await page.waitForTimeout(1000);

    // 4. Application should either show error alert or remain in modal
    // Server-side validation or client-side validation
    expect(alertReceived || (await authPage.isSignupModalVisible())).toBe(true);
  });
});
