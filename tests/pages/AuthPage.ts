import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AuthPage extends BasePage {
  readonly signupUsernameInput: Locator;
  readonly signupPasswordInput: Locator;
  readonly signupSubmitBtn: Locator;
  readonly loginUsernameInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginSubmitBtn: Locator;
  readonly signupModal: Locator;
  readonly loginModal: Locator;

  constructor(page: Page) {
    super(page);
    this.signupModal = page.locator('#signupModal');
    this.loginModal = page.locator('#loginModal');
    this.signupUsernameInput = page.locator('#sign-username');
    this.signupPasswordInput = page.locator('#sign-password');
    this.signupSubmitBtn = this.signupModal.locator('button:text("Sign up")');
    this.loginUsernameInput = page.locator('#loginusername');
    this.loginPasswordInput = page.locator('#loginpassword');
    this.loginSubmitBtn = this.loginModal.locator('button:text("Log in")');
  }

  async isSignupModalVisible(): Promise<boolean> {
    return this.signupModal.isVisible().catch(() => false);
  }

  async isLoginModalVisible(): Promise<boolean> {
    return this.loginModal.isVisible().catch(() => false);
  }

  async fillSignupForm(username: string, password: string) {
    await this.signupUsernameInput.fill(username);
    await this.signupPasswordInput.fill(password);
  }

  async submitSignup() {
    // Setup alert handler before clicking
    const alertPromise = this.waitForAlertAndAccept();
    await this.signupSubmitBtn.click();
    try {
      const message = await Promise.race([
        alertPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Alert timeout')), 5000)
        ),
      ]);
      return message as string;
    } catch (e) {
      return null;
    }
  }

  async fillLoginForm(username: string, password: string) {
    await this.loginUsernameInput.fill(username);
    await this.loginPasswordInput.fill(password);
  }

  async submitLogin() {
    // Setup alert handler before clicking
    const alertPromise = this.waitForAlertAndAccept();
    await this.loginSubmitBtn.click();
    try {
      const message = await Promise.race([
        alertPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Alert timeout')), 5000)
        ),
      ]);
      return message as string;
    } catch (e) {
      return null;
    }
  }

  async registerNewUser(username: string, password: string): Promise<boolean> {
    await this.fillSignupForm(username, password);
    const alert = await this.submitSignup();
    return alert?.includes('Sign up successful') ?? false;
  }

  async loginUser(username: string, password: string): Promise<boolean> {
    await this.fillLoginForm(username, password);
    const alert = await this.submitLogin();
    return !alert?.includes('Wrong password') && !alert?.includes('User does not exist');
  }
}
