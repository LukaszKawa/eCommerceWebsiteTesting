/**
 * Test utilities and helpers
 */

export function generateUniqueUsername(prefix: string = 'user'): string {
  return `${prefix}_${Date.now()}`;
}

export function generateTestCredentials(username?: string) {
  return {
    username: username || generateUniqueUsername('testuser'),
    password: 'TestPass123!',
  };
}

export function getRandomPrice(min: number = 100, max: number = 2000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function waitForAlertWithTimeout(
  page: any,
  timeoutMs: number = 5000
): Promise<string | null> {
  return new Promise<string | null>((resolve) => {
    const timeout = setTimeout(() => resolve(null), timeoutMs);

    page.once('dialog', async (dialog: any) => {
      clearTimeout(timeout);
      const message = dialog.message();
      await dialog.accept();
      resolve(message);
    });
  });
}

export function formatPrice(price: string): number {
  // Remove currency symbols and parse
  return parseFloat(price.replace(/[^0-9.-]+/g, ''));
}

export const TEST_DATA = {
  VALID_CARD: '4111111111111111',
  VALID_MONTH: '12',
  VALID_YEAR: '2025',
  VALID_NAME: 'John Test',
  VALID_COUNTRY: 'USA',
  VALID_CITY: 'Test City',
  INVALID_COUPON: 'INVALID123',
  CATEGORIES: {
    PHONES: 'phones',
    LAPTOPS: 'laptops',
    MONITORS: 'monitors',
  },
};
