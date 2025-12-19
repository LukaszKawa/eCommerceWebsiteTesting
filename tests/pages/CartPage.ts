import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartTable: Locator;
  readonly cartItems: Locator;
  readonly removeButtons: Locator;
  readonly totalPrice: Locator;
  readonly placeOrderBtn: Locator;
  readonly couponInput: Locator;
  readonly applyCouponBtn: Locator;
  readonly emptyCartMessage: Locator;
  readonly cartItemName: Locator;
  readonly cartItemPrice: Locator;

  constructor(page: Page) {
    super(page);
    this.cartTable = page.locator('table tbody#tbodyid, tbody[id="tbodyid"]');
    this.cartItems = page.locator('table tbody#tbodyid tr, tbody[id="tbodyid"] tr');
    this.removeButtons = page.getByRole('link', { name: 'Delete' });
    this.totalPrice = page.locator('h3[id="totalp"], #totalp');
    this.placeOrderBtn = page.locator('button').filter({ hasText: 'Place Order' });
    this.couponInput = page.locator('input[id="coupontext"], input[placeholder*="Promo"], input[placeholder*="Coupon"]');
    this.applyCouponBtn = page.locator('button[id="applycoupon"], button').filter({ hasText: /Apply|Coupon/ });
    this.emptyCartMessage = page.locator('text=/[Cc]art.*empty|No items/');
    this.cartItemName = page.locator('tbody#tbodyid tr td:nth-child(2), tbody tr td:nth-child(2)');
    this.cartItemPrice = page.locator('tbody#tbodyid tr td:nth-child(3), tbody tr td:nth-child(3)');
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getCartTotalPrice(): Promise<string | null> {
    const isVisible = await this.totalPrice.isVisible().catch(() => false);
    if (!isVisible) return null;
    return this.totalPrice.textContent();
  }

  async removeFirstItem() {
    const count = await this.removeButtons.count();
    if (count > 0) {
      // Setup alert handler before clicking delete
      const alertPromise = new Promise<void>((resolve) => {
        this.page.once('dialog', async (dialog) => {
          await dialog.accept();
          resolve();
        });
      });
      
      await this.removeButtons.first().click();
      
      try {
        await Promise.race([
          alertPromise,
          new Promise((resolve) => setTimeout(resolve, 5000)),
        ]);
      } catch (e) {
        // Alert might not appear
      }
      await this.page.waitForTimeout(1000);
    }
  }

  async isCartEmpty(): Promise<boolean> {
    const itemCount = await this.getCartItemCount();
    return itemCount === 0;
  }

  async clickPlaceOrder() {
    await this.placeOrderBtn.click();
    await this.page.waitForTimeout(500);
  }

  async hasCouponField(): Promise<boolean> {
    return this.couponInput.isVisible().catch(() => false);
  }

  async applyCoupon(code: string): Promise<string | null> {
    const hasCoupon = await this.hasCouponField();
    if (!hasCoupon) return null;

    await this.couponInput.fill(code);
    const alertPromise = this.waitForAlertAndAccept();
    await this.applyCouponBtn.click();
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

  async getFirstItemName(): Promise<string | null> {
    return this.cartItemName.first().textContent();
  }

  async getFirstItemPrice(): Promise<string | null> {
    return this.cartItemPrice.first().textContent();
  }
}
