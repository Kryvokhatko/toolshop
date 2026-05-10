"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_fixtures_1 = require("../../lib/fixtures/ui.fixtures");
const networkHelper_1 = require("../../lib/utils/networkHelper");
const ordersPayloadBuilder_1 = require("../testData/builders/ordersPayloadBuilder");
const fakeHandToolsPayload_1 = require("../testData/fakeHandToolsPayload");
const fakeOrdersPayload_1 = require("../testData/fakeOrdersPayload");
const invoiceUrl = 'https://api.practicesoftwaretesting.com/invoices?page=1';
const handToolUrl = 'https://api.practicesoftwaretesting.com/products?page=1&by_category_slug=hand-tools';
ui_fixtures_1.test.describe('Network Interception', { tag: ['@regression', '@ui'] }, () => {
    (0, ui_fixtures_1.test)('Mock orders response — empty list hides all orders', async ({ adminPage, adminPageObjects }) => {
        const network = new networkHelper_1.NetworkHelper(adminPage);
        await network.mockOrdersResponse(invoiceUrl, fakeOrdersPayload_1.fakeOrdersPayload);
        await adminPageObjects.adminOrdersPage.openOrdersList();
        await adminPageObjects.adminOrdersPage.assertNoOrdersVisible();
        // Restore real network and confirm real orders reappear
        await network.unroute(invoiceUrl);
        await adminPageObjects.adminOrdersPage.openOrdersList();
    });
    (0, ui_fixtures_1.test)('Mock orders response with Builder — empty list via OrdersPayloadBuilder', async ({ adminPage, adminPageObjects, }) => {
        const network = new networkHelper_1.NetworkHelper(adminPage);
        const emptyOrdersPayload = new ordersPayloadBuilder_1.OrdersPayloadBuilder().build();
        await network.mockOrdersResponse(invoiceUrl, emptyOrdersPayload);
        await adminPageObjects.adminOrdersPage.openOrdersList();
        await adminPageObjects.adminOrdersPage.assertNoOrdersVisible();
        // Restore real network
        await network.unroute(invoiceUrl);
        await adminPageObjects.adminOrdersPage.openOrdersList();
    });
    (0, ui_fixtures_1.test)('Mock category response — only one hand tool visible', async ({ customerPage, customerPageObjects }) => {
        const network = new networkHelper_1.NetworkHelper(customerPage);
        await network.mockOrdersResponse(handToolUrl, fakeHandToolsPayload_1.fakeHandToolsPayload);
        await customerPageObjects.categoryHandToolsPage.openCategoryHandTools();
        await customerPageObjects.categoryHandToolsPage.assertOnlyOneToolVisible();
    });
});
