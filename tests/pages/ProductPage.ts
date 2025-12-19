import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly productImage: Locator;
  readonly addToCartBtn: Locator;
  readonly backBtn: Locator;
  readonly reviewsSection: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.locator('h2').first();
    this.productPrice = page.locator('h3').first();
    this.productDescription = page.locator('.tab-content').locator('p').first();
    this.productImage = page.locator('.product-image img, img[alt], img[src*="img"]').first();
    this.addToCartBtn = page.getByRole('link', { name: 'Add to cart' });
    this.backBtn = page.locator('button').filter({ hasText: 'Back' }).first();
    this.reviewsSection = page.locator('#reviews, .reviews');
  }

  async getProductTitle(): Promise<string | null> {
    return this.productTitle.textContent();
  }

  async getProductPrice(): Promise<string | null> {
    return this.productPrice.textContent();
  }

  async getProductDescription(): Promise<string | null> {
    return this.productDescription.textContent();
  }

  async isProductImageVisible(): Promise<boolean> {
    return this.productImage.isVisible();
  }

  async isAddToCartButtonVisible(): Promise<boolean> {
    return this.addToCartBtn.isVisible();
  }

  async clickAddToCart() {
    const alertPromise = this.waitForAlertAndAccept();
    await this.addToCartBtn.click();
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

  async goBack() {
    await this.backBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async hasCompleteProductInfo(): Promise<boolean> {
    const title = await this.productTitle.isVisible();
    const price = await this.productPrice.isVisible();
    const image = await this.productImage.isVisible();
    const addBtn = await this.addToCartBtn.isVisible();
    return title && price && image && addBtn;
  }
}
