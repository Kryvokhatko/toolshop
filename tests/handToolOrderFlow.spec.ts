import { test, expect } from '../lib/fixtures/ui.fixtures';

test('Make an order of Hand Tool as a Customer and complete flow as an Admin', async ({ customerPage, adminPage, customerPageObjects, adminPageObjects }) => {
  test.setTimeout(180000);

  // Customer starts from authenticated account page.
  await customerPage.goto('/account');
  await expect(customerPage).toHaveURL(/\/account(?:[/?#]|$)/);

  //await customerPage.locator('[data-test="nav-categories"]').click();
  //await customerPage.locator('[data-test="nav-hand-tools"]').click();
  await customerPageObjects.accountPage.selectCategory();
  await expect(customerPage).toHaveURL(/\/category\/hand-tools(?:[/?#]|$)/);
  await expect(customerPage.getByRole('heading', { name: 'Category: Hand Tools' })).toBeVisible();

  await customerPageObjects.categoryHandToolsPage.openPage3();
  await customerPageObjects.categoryHandToolsPage.openTapeMeasure5m();

  await customerPageObjects.productPage.assertOpened();
  await customerPageObjects.productPage.addToCart();

  await customerPageObjects.checkoutPage.openFromCart();
  await customerPageObjects.checkoutPage.verifyItemInCart('Tape Measure 5m');
  await customerPageObjects.checkoutPage.proceedToPaymentStep();
  await customerPageObjects.checkoutPage.fillCreditCard({
    cardNumber: '1111-2222-3333-4444',
    expiration: '12/2029',
    cvv: '123',
    cardHolder: 'Customer UniqueUser',
  });

  const invoiceNumber = await customerPageObjects.checkoutPage.completePaymentAndCaptureInvoice();

  // Admin validates and completes the same order by captured invoice number.
  await adminPageObjects.adminOrdersPage.openDashboard();
  await adminPageObjects.adminOrdersPage.openEditForInvoice(invoiceNumber);
  await adminPageObjects.adminOrdersPage.updateStatus('COMPLETED');
  await adminPageObjects.adminOrdersPage.openOrdersList();
  await adminPageObjects.adminOrdersPage.verifyInvoiceStatus(invoiceNumber, 'COMPLETED');
});
