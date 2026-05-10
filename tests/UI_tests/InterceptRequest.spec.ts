import { test } from '../../lib/fixtures/ui.fixtures';
import { NetworkHelper } from '../../lib/utils/networkHelper';
import { OrdersPayloadBuilder } from '../testData/builders/ordersPayloadBuilder';
import { fakeHandToolsPayload } from '../testData/fakeHandToolsPayload';
import { fakeOrdersPayload } from '../testData/fakeOrdersPayload';

const invoiceUrl = 'https://api.practicesoftwaretesting.com/invoices?page=1';
const handToolUrl = 'https://api.practicesoftwaretesting.com/products?page=1&by_category_slug=hand-tools';

test.describe('Network Interception', { tag: ['@regression', '@ui'] }, () => {
    test('Mock orders response — empty list hides all orders', async ({ adminPage, adminPageObjects }) => {
        const network = new NetworkHelper(adminPage);
        await network.mockOrdersResponse(invoiceUrl, fakeOrdersPayload);

        await adminPageObjects.adminOrdersPage.openOrdersList();
        await adminPageObjects.adminOrdersPage.assertNoOrdersVisible();

        // Restore real network and confirm real orders reappear
        await network.unroute(invoiceUrl);
        await adminPageObjects.adminOrdersPage.openOrdersList();
    });

    test('Mock orders response with Builder — empty list via OrdersPayloadBuilder', async ({
        adminPage,
        adminPageObjects,
    }) => {
        const network = new NetworkHelper(adminPage);
        const emptyOrdersPayload = new OrdersPayloadBuilder().build();

        await network.mockOrdersResponse(invoiceUrl, emptyOrdersPayload);
        await adminPageObjects.adminOrdersPage.openOrdersList();
        await adminPageObjects.adminOrdersPage.assertNoOrdersVisible();

        // Restore real network
        await network.unroute(invoiceUrl);
        await adminPageObjects.adminOrdersPage.openOrdersList();
    });

    test('Mock category response — only one hand tool visible', async ({ customerPage, customerPageObjects }) => {
        const network = new NetworkHelper(customerPage);
        await network.mockOrdersResponse(handToolUrl, fakeHandToolsPayload);

        await customerPageObjects.categoryHandToolsPage.openCategoryHandTools();
        await customerPageObjects.categoryHandToolsPage.assertOnlyOneToolVisible();
    });
});
