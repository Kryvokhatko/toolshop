import { test, expect } from '../lib/fixtures/ui.fixtures';

test('Make an order of Hand Tool as a Customer and complete flow as an Admin', async ({ customerPage, adminPage }) => {
  test.setTimeout(180000);

  // Customer starts from authenticated account page.
  await customerPage.goto('/account');
  await expect(customerPage).toHaveURL(/\/account(?:[/?#]|$)/);

  await customerPage.locator('[data-test="nav-categories"]').click();
  await customerPage.locator('[data-test="nav-hand-tools"]').click();
  await expect(customerPage).toHaveURL(/\/category\/hand-tools(?:[/?#]|$)/);
  await expect(customerPage.getByRole('heading', { name: 'Category: Hand Tools' })).toBeVisible();

  await customerPage.getByRole('button', { name: 'Page-3' }).click();
  const tapeMeasureCard = customerPage.locator('[data-test^="product-"]', {
    has: customerPage.locator('[data-test="product-name"]', { hasText: 'Tape Measure 5m' }),
  }).first();
  await expect(tapeMeasureCard).toBeVisible();
  await tapeMeasureCard.click();

  await expect(customerPage).toHaveURL(/\/product\/[A-Za-z0-9]+(?:[/?#]|$)/);
  await expect(customerPage.getByRole('heading', { name: 'Tape Measure 5m' })).toBeVisible();

  await customerPage.locator('[data-test="add-to-cart"]').click();
  await expect(customerPage.getByRole('alert')).toContainText('Product added to shopping cart.');

  await customerPage.locator('[data-test="nav-cart"]').click();
  await expect(customerPage).toHaveURL(/\/checkout(?:[/?#]|$)/);
  await expect(customerPage.locator('.steps-4.steps-indicator')).toBeVisible();
  await expect(customerPage.locator('tbody')).toContainText('Tape Measure 5m');

  await customerPage.locator('[data-test="proceed-1"]').click();
  await expect(customerPage.locator('app-login')).toContainText('you are already logged in. You can proceed to checkout.');

  await customerPage.locator('[data-test="proceed-2"]').click();
  await expect(customerPage.getByRole('heading', { name: 'Billing Address' })).toBeVisible();

  await customerPage.locator('[data-test="proceed-3"]').click();
  await expect(customerPage.getByRole('heading', { name: 'Payment' })).toBeVisible();

  await customerPage.locator('[data-test="payment-method"]').selectOption('credit-card');
  await customerPage.locator('[data-test="credit_card_number"]').fill('1111-2222-3333-4444');
  await customerPage.locator('[data-test="expiration_date"]').fill('12/2029');
  await customerPage.locator('[data-test="cvv"]').fill('123');
  await customerPage.locator('[data-test="card_holder_name"]').fill('Customer UniqueUser');

  await customerPage.locator('[data-test="finish"]').click();
  await expect(customerPage.locator('[data-test="payment-success-message"]')).toContainText('Payment was successful');

  await customerPage.locator('[data-test="finish"]').click();
  const orderConfirmation = customerPage.locator('#order-confirmation');
  await expect(orderConfirmation).toContainText('Thanks for your order! Your invoice number is');
  const confirmationText = (await orderConfirmation.innerText()).trim();
  const invoiceMatch = confirmationText.match(/INV-\d+/);
  expect(invoiceMatch, `Invoice number not found in confirmation text: ${confirmationText}`).not.toBeNull();
  const invoiceNumber = invoiceMatch![0];

  // Admin validates and completes the same order by captured invoice number.
  await adminPage.goto('/admin/dashboard');
  await expect(adminPage).toHaveURL(/\/admin\/dashboard(?:[/?#]|$)/);
  await expect(adminPage.getByRole('heading', { name: 'Latest orders' })).toBeVisible();

  const latestOrdersRow = adminPage.getByRole('row').filter({ hasText: invoiceNumber }).first();
  await expect(latestOrdersRow).toBeVisible();
  await latestOrdersRow.getByRole('link', { name: 'Edit' }).click();

  await expect(adminPage).toHaveURL(/\/admin\/orders\/edit\/[A-Za-z0-9]+(?:[/?#]|$)/);
  await adminPage.locator('[data-test="order-status"]').selectOption('COMPLETED');
  await adminPage.locator('[data-test="update-status-submit"]').click();
  await expect(adminPage.getByRole('alert')).toContainText('Status updated!');

  await adminPage.goto('/admin/orders');
  await expect(adminPage).toHaveURL(/\/admin\/orders(?:[/?#]|$)/);
  const completedRow = adminPage.getByRole('row').filter({ hasText: invoiceNumber }).first();
  await expect(completedRow).toBeVisible();
  await expect(completedRow).toContainText('COMPLETED');
});
