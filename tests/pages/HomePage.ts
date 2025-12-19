import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly signupBtn: Locator;
  readonly loginBtn: Locator;
  readonly logoutBtn: Locator;
  readonly usernameDisplay: Locator;
  readonly cartLink: Locator;
  readonly phonesCategoryBtn: Locator;
  readonly laptopsCategoryBtn: Locator;
  readonly monitorsCategoryBtn: Locator;
  readonly productCards: Locator;
  readonly nextPageBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.signupBtn = page.locator('#signin2');
    this.loginBtn = page.locator('#login2');
    this.logoutBtn = page.locator('#logout2');
    this.usernameDisplay = page.locator('#nameofuser');
    this.cartLink = page.locator('a[href="#cart"]');
    this.phonesCategoryBtn = page.locator('a:text("Phones")').first();
    this.laptopsCategoryBtn = page.locator('a:text("Laptops")').first();
    this.monitorsCategoryBtn = page.locator('a:text("Monitors")').first();
    this.productCards = page.locator('.hrefch');
    this.nextPageBtn = page.locator('button:text("Next")');
  }

  async openSignupModal() {
    await this.signupBtn.click();
    await this.page.waitForTimeout(500);
  }

  async openLoginModal() {
    await this.loginBtn.click();
    await this.page.waitForTimeout(500);
  }

  async clickLogout() {
    await this.logoutBtn.click();
    await this.page.waitForTimeout(500);
  }

  async getUsernameDisplay(): Promise<string | null> {
    const isVisible = await this.usernameDisplay.isVisible().catch(() => false);
    if (!isVisible) return null;
    return this.usernameDisplay.textContent();
  }

  async openCart() {
    await this.cartLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectCategory(category: 'phones' | 'laptops' | 'monitors') {
    const buttons: Record<string, Locator> = {
      phones: this.phonesCategoryBtn,
      laptops: this.laptopsCategoryBtn,
      monitors: this.monitorsCategoryBtn,
    };
    await buttons[category].click();
    await this.page.waitForTimeout(800);
  }

  async getFirstProduct() {
    await this.productCards.first().waitFor({ state: 'visible', timeout: 5000 });
    return this.productCards.first();
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }
}
