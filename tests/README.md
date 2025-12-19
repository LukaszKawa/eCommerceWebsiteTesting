# E2E Test Suite for demoblaze eCommerce

Comprehensive Playwright test suite for https://www.demoblaze.com/ with Page Object Model pattern and fixtures for authenticated users.

## Project Structure

```
tests/
├── pages/                    # Page Object Models
│   ├── BasePage.ts          # Base class for all pages
│   ├── HomePage.ts          # Home page elements & interactions
│   ├── AuthPage.ts          # Authentication modal elements
│   ├── ProductPage.ts       # Product details page
│   ├── CartPage.ts          # Shopping cart page
│   ├── CheckoutPage.ts      # Checkout/order form
│   └── index.ts             # Page Objects export
├── fixtures.ts              # Test fixtures (page objects + logged-in user)
├── authentication/
│   ├── registration.spec.ts # User registration tests
│   └── login-session.spec.ts # Login and session tests
├── products/
│   ├── search-filter.spec.ts # Product discovery via categories
│   └── browse-category.spec.ts # Browse products and details
├── cart/
│   ├── add-to-cart.spec.ts  # Add products to cart
│   ├── mutations.spec.ts    # Cart mutations (remove, quantity)
│   ├── coupon.spec.ts       # Coupon/discount application
│   └── checkout.spec.ts     # Complete checkout flow
└── seed.spec.ts             # Seed test
```

## Features

### Page Object Model (POM)
- **BasePage**: Common functionality (navigation, alerts, waits)
- **HomePage**: Category selection, product listing, cart link
- **AuthPage**: Login and signup modals, form filling
- **ProductPage**: Product details, add to cart
- **CartPage**: Cart items, totals, remove items, coupon application
- **CheckoutPage**: Order form, purchase confirmation

### Test Fixtures
```typescript
import { test, authenticatedTest, expect } from './fixtures';

// Basic tests with page objects
test('test name', async ({ homePage, authPage, productPage, cartPage, checkoutPage }) => {
  // Test code
});

// Tests requiring authenticated user
authenticatedTest('test name', async ({ loggedInUser, homePage, cartPage }) => {
  // User is already logged in via fixture
  // loggedInUser.username and loggedInUser.password available
});
```

### Test Coverage

#### Authentication (2 test files, 6 tests)
- ✅ User Registration - Happy Path (valid credentials)
- ✅ User Registration - Negative (empty fields, weak password)
- ✅ Login - Happy Path (valid credentials)
- ✅ Login - Negative (invalid credentials)
- ✅ Session Persistence (reload, logout)
- ✅ Session Persistence - Logout flow

#### Product Discovery (2 test files, 8 tests)
- ✅ Browse Categories (Phones, Laptops, Monitors)
- ✅ Verify Product Cards (essential info)
- ✅ Pagination (if available)
- ✅ Product Details Page
- ✅ Complete Product Information
- ✅ Product Description
- ✅ Back Button Navigation

#### Cart & Checkout (4 test files, 12 tests)
- ✅ Add to Cart (single and multiple products)
- ✅ Cart Total Updates
- ✅ Remove Items from Cart
- ✅ Cart Persistence After Reload
- ✅ Add Same Item Multiple Times
- ✅ Coupon Application (invalid code, feature detection)
- ✅ Complete Checkout Flow
- ✅ Empty Form Validation
- ✅ Partial Form Validation

**Total: 26 atomic, independent tests**

## Running Tests

### All tests
```bash
npm test
# or
npx playwright test
```

### Run specific test file
```bash
npx playwright test tests/authentication/registration.spec.ts
```

### Run with specific browser
```bash
npx playwright test -p chromium
npx playwright test -p firefox
npx playwright test -p webkit
```

### Run with UI mode (interactive)
```bash
npx playwright test --ui
```

### Run in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run single test
```bash
npx playwright test -g "User Registration - Happy Path"
```

## Configuration

### playwright.config.ts
- **Base URL**: `https://www.demoblaze.com/`
- **Browsers**: Chromium (via system Chrome), Firefox, WebKit
- **Report**: HTML reporter
- **Trace**: Collected on first retry

### Test Execution
- Fully parallel execution (default)
- CI: Sequential execution with 2 retries
- Timeout: 30 seconds per test
- Network wait: `networkidle` for page loads

## Key Patterns

### Alert Handling
```typescript
// Declare handler before action
const alertPromise = page.waitForAlertAndAccept();
await button.click();
const message = await Promise.race([
  alertPromise,
  new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
]);
```

### Atomic Tests
- Each test is self-contained and independent
- No dependencies between tests
- Clean data creation (unique usernames with timestamp)
- Cleanup (logout) in fixtures

### Conditional Test Skipping
```typescript
const hasCoupon = await cartPage.hasCouponField();
if (!hasCoupon) {
  test.skip(); // Skip if feature not available
}
```

## Locators Used

The tests use the following selector strategies:
- **IDs**: `#signin2`, `#login2`, `#cart`, `#tbodyid`
- **Text**: `text=Sign up`, `a:text("Log in")`
- **CSS Classes**: `.hrefch` (product cards), `.btn-default`
- **Attributes**: `href="#cart"`, `type="search"`

Verify these selectors match your application's HTML structure. Update `pages/*.ts` if selectors don't match.

## Troubleshooting

### Tests timeout on alerts
- Increase timeout in `Promise.race()` calls
- Verify alert dialogs are triggered by actions

### Cart doesn't persist
- Check browser storage (localStorage/sessionStorage)
- Verify cart page waits for network idle

### Selectors not found
- Use `npx playwright codegen https://www.demoblaze.com/` to record selectors
- Update locators in `pages/*.ts` files

### WebKit failures
- WebKit may not support all features
- Disable WebKit in `playwright.config.ts` if needed

## Performance Notes

- Average test duration: 2-5 seconds per test
- Total suite execution: ~2-3 minutes (parallel)
- Network requests cached where possible

## Future Improvements

- [ ] Add visual regression tests
- [ ] Add accessibility tests (ARIA labels)
- [ ] Add performance metrics collection
- [ ] Database cleanup fixtures
- [ ] API mocking for faster tests
- [ ] Visual diff reports
