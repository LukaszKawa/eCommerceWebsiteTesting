// spec: specs/test.plan.md
// section: 1.2 Login and Session Persistence

import { authenticatedTest, test, expect } from '../fixtures';

test.describe('Authentication', () => {
  test.beforeEach(async ({ homePage }) => {
    // Navigate to home page before each test
    await homePage.goto();
  });

  test('Login and Session - Happy Path: Successful login with valid credentials', async ({
    page,
    homePage,
    authPage,
  }) => {
    // Pre-create a test account
    const testUser = {
      username: `preuser_${Date.now()}`,
      password: 'TestPass123!',
    };

    // Register user first
    await homePage.openSignupModal();
    const signupAlert = authPage.waitForAlertAndAccept();
    await authPage.fillSignupForm(testUser.username, testUser.password);
    await authPage.signupSubmitBtn.click();
    await Promise.race([signupAlert, new Promise(r => setTimeout(r, 5000))]).catch(
      () => {}
    );

    // 1. Navigate to home and open login modal
    await homePage.goto();
    await homePage.openLoginModal();
    expect(await authPage.isLoginModalVisible()).toBe(true);

    // 2. Fill login form with valid credentials
    const loginAlert = authPage.waitForAlertAndAccept();
    await authPage.fillLoginForm(testUser.username, testUser.password);
    await authPage.loginSubmitBtn.click();

    // 3. Handle login alert
    await Promise.race([loginAlert, new Promise(r => setTimeout(r, 5000))]).catch(
      () => {}
    );

    // 4. Verify logged-in state
    await homePage.goto();
    await page.waitForTimeout(500);
    const displayedUsername = await homePage.getUsernameDisplay();
    expect(displayedUsername).toContain(testUser.username);

    // 5. Verify session persistence after page refresh
    await page.reload();
    await page.waitForTimeout(500);
    const usernameAfterRefresh = await homePage.getUsernameDisplay();
    expect(usernameAfterRefresh).toContain(testUser.username);

    // 6. Verify logout functionality
    await homePage.clickLogout();
    await page.waitForTimeout(500);
    const usernameAfterLogout = await homePage.getUsernameDisplay();
    expect(usernameAfterLogout).toBeNull();
  });

  test('Login and Session - Negative: Reject invalid credentials', async ({
    page,
    homePage,
    authPage,
  }) => {
    // 1. Open login modal
    await homePage.openLoginModal();
    expect(await authPage.isLoginModalVisible()).toBe(true);

    // 3. Try to login with invalid credentials
    let invalidAlertMessage = '';
    page.once('dialog', async (dialog) => {
      invalidAlertMessage = dialog.message();
      await dialog.accept();
    });

    await authPage.fillLoginForm('nonexistentuser', 'wrongpassword');
    await authPage.loginSubmitBtn.click();
    await page.waitForTimeout(1000);

    // 4. Verify error message or modal remains visible
    expect(
      invalidAlertMessage.toLowerCase().includes('wrong') ||
        invalidAlertMessage.toLowerCase().includes('does not exist') ||
        (await authPage.isLoginModalVisible())
    ).toBe(true);

    // 5. Verify NOT logged in
    await homePage.goto();
    const username = await homePage.getUsernameDisplay();
    expect(username).toBeNull();
  });

  test('Login and Session - Verify logout clears session', async ({
    page,
    homePage,
    authPage,
  }) => {
    // Pre-create and login user
    const testUser = {
      username: `logouttest_${Date.now()}`,
      password: 'TestPass123!',
    };

    // Register
    await homePage.openSignupModal();
    const signupPromise = authPage.waitForAlertAndAccept();
    await authPage.fillSignupForm(testUser.username, testUser.password);
    await authPage.signupSubmitBtn.click();
    await Promise.race([signupPromise, new Promise(r => setTimeout(r, 5000))]).catch(
      () => {}
    );

    // Login
    await homePage.goto();
    await homePage.openLoginModal();
    const loginPromise = authPage.waitForAlertAndAccept();
    await authPage.fillLoginForm(testUser.username, testUser.password);
    await authPage.loginSubmitBtn.click();
    await Promise.race([loginPromise, new Promise(r => setTimeout(r, 5000))]).catch(
      () => {}
    );

    // Verify logged in
    await homePage.goto();
    await page.waitForTimeout(500);
    let username = await homePage.getUsernameDisplay();
    expect(username).toContain(testUser.username);

    // Logout
    await homePage.clickLogout();
    await page.waitForTimeout(500);

    // Verify logged out
    const usernameAfterLogout = await homePage.getUsernameDisplay();
    expect(usernameAfterLogout).toBeNull();

    // Verify login button is visible again
    const loginBtnVisible = await homePage.loginBtn.isVisible();
    expect(loginBtnVisible).toBe(true);
  });
});
