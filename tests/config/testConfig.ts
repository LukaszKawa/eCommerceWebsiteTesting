/**
 * Test configuration and constants
 */

export const TEST_CONFIG = {
  // Timeouts
  TIMEOUT_ALERT: 5000,
  TIMEOUT_WAIT: 3000,
  TIMEOUT_NAVIGATION: 10000,

  // User data
  TEST_USER_PREFIX: 'e2etest',
  DEFAULT_PASSWORD: 'TestPass123!',

  // Product categories
  CATEGORIES: ['Phones', 'Laptops', 'Monitors'],

  // Selectors
  SELECTORS: {
    SIGNUP_BTN: '#signin2',
    LOGIN_BTN: '#login2',
    LOGOUT_BTN: '#logout2',
    USERNAME_DISPLAY: '#nameofuser',
    CART_LINK: 'a[href="#cart"]',
    PRODUCT_CARDS: '.hrefch',
    ADD_TO_CART_BTN: 'a.btn-default:text("Add to cart")',
    PLACE_ORDER_BTN: 'button:text("Place Order")',
    PURCHASE_BTN: 'button:text("Purchase")',
    CART_TABLE: '#tbodyid',
    CART_ITEMS: '#tbodyid tr',
    CART_TOTAL: '#totalp',
    COUPON_INPUT: 'input#coupontext',
    APPLY_COUPON_BTN: 'button#applycoupon',
  },

  // URLs
  BASE_URL: 'https://www.demoblaze.com/',
  HOME_PATH: '/',
  CART_PATH: '#cart',
  PRODUCT_DETAIL_PATH: 'prod.html',

  // Error messages
  MESSAGES: {
    SIGNUP_SUCCESS: 'Sign up successful',
    WRONG_PASSWORD: 'Wrong password',
    USER_NOT_FOUND: 'User does not exist',
    PRODUCT_ADDED: 'added',
  },
};

export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // ms
};

export const WAIT_CONFIG = {
  navigationTimeout: 30000,
  actionTimeout: 10000,
  alertTimeout: 5000,
};
