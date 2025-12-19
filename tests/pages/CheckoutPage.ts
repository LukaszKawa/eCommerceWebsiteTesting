import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly nameInput: Locator;
  readonly countryInput: Locator;
  readonly cityInput: Locator;
  readonly creditCardInput: Locator;
  readonly monthInput: Locator;
  readonly yearInput: Locator;
  readonly purchaseBtn: Locator;
  readonly closeModal: Locator;
  readonly confirmationText: Locator;
  readonly orderIdText: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.locator('input[id="name"]');
    this.countryInput = page.locator('input[id="country"]');
    this.cityInput = page.locator('input[id="city"]');
    this.creditCardInput = page.locator('input[id="card"]');
    this.monthInput = page.locator('input[id="month"]');
    this.yearInput = page.locator('input[id="year"]');
    this.purchaseBtn = page.locator('button').filter({ hasText: 'Purchase' });
    this.closeModal = page.locator('button').filter({ hasText: 'OK' }).last();
    this.confirmationText = page.locator('h2').filter({ hasText: /Thank you|success/i });
    this.orderIdText = page.locator('p').filter({ hasText: /Id:|Order/ }).first();
  }

  async isCheckoutModalVisible(): Promise<boolean> {
    const modal = this.page.locator('#orderModal');
    return modal.isVisible().catch(() => false);
  }

  async fillCheckoutForm(
    name: string,
    country: string,
    city: string,
    card: string,
    month: string,
    year: string
  ) {
    await this.nameInput.fill(name);
    await this.countryInput.fill(country);
    await this.cityInput.fill(city);
    await this.creditCardInput.fill(card);
    await this.monthInput.fill(month);
    await this.yearInput.fill(year);
  }

  async clickPurchase() {
    await this.purchaseBtn.click();
    await this.page.waitForTimeout(1000);
  }

  async getConfirmationMessage(): Promise<string | null> {
    const isVisible = await this.confirmationText.isVisible().catch(() => false);
    if (!isVisible) return null;
    return this.confirmationText.textContent();
  }

  async getOrderId(): Promise<string | null> {
    const isVisible = await this.orderIdText.isVisible().catch(() => false);
    if (!isVisible) return null;
    return this.orderIdText.textContent();
  }

  async closeConfirmationModal() {
    const isVisible = await this.closeModal.isVisible().catch(() => false);
    if (isVisible) {
      await this.closeModal.click();
      await this.page.waitForTimeout(500);
    }
  }
}
