import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.skip(!process.env.RUN_MANUAL_REGISTER, 'Manual account bootstrap is excluded from default local and CI runs.');

test('Register user manually @register', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
    await page.locator('[data-test="nav-sign-in"]').click();
    await page.locator('[data-test="register-link"]').click();
    await page.locator('#first_name').fill('Customer');
    await page.locator('[data-test="last-name"]').fill('User');
    await page.locator('[data-test="dob"]').fill('2000-02-22');
    await page.locator('[data-test="street"]').fill('Street');
    await page.locator('[data-test="postal_code"]').fill('03088');
    await page.locator('[data-test="city"]').fill('Kyiv');
    await page.locator('[data-test="state"]').fill('Kyiv');
    await page.locator('[data-test="country"]').selectOption('UA');
    await page.locator('[data-test="phone"]').fill('12345678');
    await page.locator('[data-test="email"]').fill(process.env.CUSTOMER_USERNAME!);
    await page.locator('[data-test="password"]').fill(process.env.CUSTOMER_PASSWORD!);
    await page.locator('[data-test="register-submit"]').click();
});

test.skip('Register user and login', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
    await page.locator('[data-test="nav-sign-in"]').click();
    await page.locator('[data-test="register-link"]').click();
    await page.locator('#first_name').fill('Customer');
    await page.locator('[data-test="last-name"]').fill('User');
    await page.locator('[data-test="dob"]').fill('2000-02-22');
    await page.locator('[data-test="street"]').fill('Street');
    await page.locator('[data-test="postal_code"]').fill('03088');
    await page.locator('[data-test="city"]').fill('Kyiv');
    await page.locator('[data-test="state"]').fill('Kyiv');
    await page.locator('[data-test="country"]').selectOption('UA');
    await page.locator('[data-test="phone"]').fill('12345678');
    await page.locator('[data-test="email"]').fill(process.env.CUSTOMER_USERNAME!);
    await page.locator('[data-test="password"]').fill(process.env.CUSTOMER_PASSWORD!);
    await page.locator('[data-test="register-submit"]').click();

    await expect(page).toHaveURL('/auth/login');
    await expect(page.getByRole('heading', {name: 'Login'})).toBeVisible();

    await page.locator('[data-test="email"]').fill(process.env.ADMIN_USERNAME!);
    await page.locator('[data-test="password"]').fill(process.env.ADMIN_PASSWORD!);
    await page.locator('[aria-label="Login"]').click();    
});