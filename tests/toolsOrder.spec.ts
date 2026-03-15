import { test, expect } from "../lib/fixtures/ui.fixtures";

test('Make order', async ({ customerPageObjects, customerPage, adminPageObjects }) => {
  //await page.goto('https://practicesoftwaretesting.com/');
  //setup

  await customerPageObjects.accountPage.categoriesSelector.click();
  await customerPageObjects.accountPage.handToolsItem.click();

  //https://practicesoftwaretesting.com/category/hand-tools
  //CategoryHandToolsPage
  await customerPageObjects.categoryHandToolsPage.pageButton3.click();
  //await expect(page.locator('[data-test="product-01KKNS6904MBRB16A1EZ9MY1BA"] [data-test="product-name"]')).toContainText('Tape Measure 5m');
  await customerPageObjects.categoryHandToolsPage.tapeMeasure5m.click();
  
  //https://practicesoftwaretesting.com/product/01KKNWM4GWPN74T2FDSENKM1CG
  await expect(page.locator('[data-test="product-name"]')).toContainText('Tape Measure 5m');
  await page.locator('[data-test="increase-quantity"]').click();
  await page.locator('[data-test="increase-quantity"]').click();

  await page.locator('[data-test="add-to-cart"]').click();
  //await page.locator('[data-test="add-to-cart"]').click();
  await expect(page.getByLabel('Product added to shopping')).toContainText('Product added to shopping cart.');

  await page.locator('[data-test="nav-cart"]').click();
  await expect(page.getByText('Cart1Sign in2Billing')).toBeVisible();
  await page.locator('[data-test="proceed-1"]').click();
  await expect(page.locator('app-login')).toContainText('Hello Customer UniqueUser, you are already logged in. You can proceed to checkout.');
  await page.locator('[data-test="proceed-2"]').click();
  await expect(page.getByRole('heading', { name: 'Billing Address' })).toBeVisible();
  await page.locator('[data-test="proceed-3"]').click();
  await expect(page.getByRole('heading', { name: 'Payment' })).toBeVisible();
  await page.locator('[data-test="payment-method"]').selectOption('credit-card');
  await page.locator('[data-test="credit_card_number"]').click();
  await page.locator('[data-test="credit_card_number"]').fill('1111-2222-3333-4444');
  await page.locator('[data-test="expiration_date"]').click();
  await page.locator('[data-test="expiration_date"]').fill('12/2029');
  await page.locator('[data-test="cvv"]').click();
  await page.locator('[data-test="cvv"]').fill('123');
  await page.locator('[data-test="card_holder_name"]').click();
  await page.locator('[data-test="card_holder_name"]').fill('Customer');
  await page.locator('[data-test="finish"]').click();
  await expect(page.locator('[data-test="payment-success-message"]')).toBeVisible();
  await expect(page.locator('[data-test="payment-success-message"]')).toContainText('Payment was successful');
  await page.locator('[data-test="finish"]').click();
  await page.locator('[data-test="finish"]').click();
  await page.locator('[data-test="finish"]').click();
  //await expect(page.locator('#order-confirmation')).toContainText('Thanks for your order! Your invoice number is INV-2026000002.');
  await page.locator('[data-test="nav-menu"]').click();
 
  await page.locator('[data-test="nav-my-invoices"]').click();

  //await expect(page.locator('tbody')).toContainText('INV-2026000002');
  await page.getByRole('link', { name: 'Details' }).click();
  //const downloadPromise = page.waitForEvent('download');
  //await page.locator('[data-test="download-invoice"]').click();
  //const download = await downloadPromise;


  //Admin
  //await page.goto('https://practicesoftwaretesting.com/auth/login');
  await page.locator('[data-test="order-edit-01kknxtt6a3y9rnb5fe8n6r0re"]').click();
  await expect(page.locator('tbody')).toContainText('INV-2026000002');
await page.getByRole('row', { name: 'INV-2026000002 Street 2026-03' }).getByRole('link').click();
await expect(page.locator('app-orders-add-edit')).toContainText('General Information');
await page.locator('[data-test="order-status"]').selectOption('SHIPPED');
await page.locator('[data-test="update-status-submit"]').click();

await page.locator('[data-test="order-status"]').selectOption('COMPLETED');
await page.locator('[data-test="update-status-submit"]').click();
await expect(page.getByRole('alert')).toContainText('Status updated!');
await page.getByRole('heading', { name: 'Billing Address' }).click();

await page.locator('[data-test="order-status"]').selectOption('COMPLETED');
await page.locator('[data-test="update-status-submit"]').click();
await page.locator('[data-test="nav-menu"]').dblclick();
await page.locator('[data-test="nav-admin-orders"]').click();


await expect(page.locator('[data-test="page-title"]')).toContainText('Order');
await expect(page.locator('tbody')).toContainText('INV-2026000002');
await expect(page.locator('tbody')).toContainText('COMPLETED');
await page.locator('[data-test="order-edit-01kknxejya73fqga36dyhvn6mt"]').click();
await page.goto('https://practicesoftwaretesting.com/admin/orders');

});