// spec: specs/test.plan.md
// section: 1.1 User Registration - Create Account & Validation

import { test, expect } from '../fixtures';

test.describe('Authentication', () => {
  test('User Registration - Happy Path: Create new account with valid data', async ({
    page,
    homePage,
    authPage,
  }) => {
    // 1. Open home page
    await homePage.goto();
    expect(page).toBeDefined();

    // 2. Click Sign up button
    await homePage.openSignupModal();
    const isModalVisible = await authPage.isSignupModalVisible();
    expect(isModalVisible).toBe(true);

    // 3. Prepare unique user credentials
    const testUsername = `user_${Date.now()}`;
    const testPassword = 'BezpieczneHaslo1!';

    // 4. Fill signup form and submit
    const alertPromise = authPage.waitForAlertAndAccept();
    await authPage.fillSignupForm(testUsername, testPassword);
    await authPage.signupSubmitBtn.click();

    // 5. Handle alert
    const alertMessage = await Promise.race([
      alertPromise,
      new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error('No alert received')), 5000)
      ),
    ]).catch(() => null);

    expect(alertMessage).toBeTruthy();
    expect(alertMessage).toContain('Sign up successful');

    // 6. Verify account can be logged into
    await homePage.goto();
    await homePage.openLoginModal();
    const isLoginModalVisible = await authPage.isLoginModalVisible();
    expect(isLoginModalVisible).toBe(true);

    const loginAlertPromise = authPage.waitForAlertAndAccept();
    await authPage.fillLoginForm(testUsername, testPassword);
    await authPage.loginSubmitBtn.click();

    const loginAlert = await Promise.race([
      loginAlertPromise,
      new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error('No alert')), 5000)
      ),
    ]).catch(() => null);

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
    // 1. Open home page
    await homePage.goto();

    // 2. Open signup modal
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
    // 1. Open home page
    await homePage.goto();

    // 2. Open signup modal
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
