import { Page, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = '/') {
    await this.page.goto(path);
  }

  async waitForLoadState() {
    await this.page.waitForLoadState('networkidle');
  }

  async handleAlert(shouldAccept: boolean = true): Promise<string | null> {
    return new Promise<string | null>((resolve) => {
      const handler = async (dialog: any) => {
        const message = dialog.message();
        if (shouldAccept) {
          await dialog.accept();
        } else {
          await dialog.dismiss();
        }
        resolve(message);
      };
      this.page.once('dialog', handler);
    });
  }

  async waitForAlertAndAccept(): Promise<string> {
    return new Promise<string>((resolve) => {
      this.page.once('dialog', async (dialog: any) => {
        const message = dialog.message();
        await dialog.accept();
        resolve(message);
      });
    });
  }
}
