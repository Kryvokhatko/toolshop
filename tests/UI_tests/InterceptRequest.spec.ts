import { test } from "../../lib/fixtures/ui.fixtures";
import { NetworkHelper } from "../../lib/utils/networkHelper";
import { OrdersPayloadBuilder } from "../testData/builders/ordersPayloadBuilder";
import { fakeHandToolsPayload } from '../testData/fakeHandToolsPayload';
import { fakeOrdersPayload } from '../testData/fakeOrdersPayload';

const invoiceUrl = "https://api.practicesoftwaretesting.com/invoices?page=1";

test('Intercept response Admin/Orders to have empty page', async ({ adminPage, adminPageObjects }) => {
    const network = new NetworkHelper(adminPage);
    // Intercept API request on demand and return an empty orders/invoices list
    await network.mockOrdersResponse(invoiceUrl, fakeOrdersPayload);

    await adminPageObjects.adminOrdersPage.openOrdersList();
    await adminPageObjects.adminOrdersPage.assertNoOrdersVisible();

    // Remove the mock, restore real network
    await network.unroute(invoiceUrl);
    await adminPageObjects.adminOrdersPage.openOrdersList();
    // now real orders are fetched from the server
});

test('Intercept response Admin/Orders to have empty page with Data Builder example', async ({ adminPage, adminPageObjects }) => {
    const network = new NetworkHelper(adminPage);
    const emptyOrdersPayload = new OrdersPayloadBuilder().build();
    //or 1 fake order
    const oneOrderPayload = new OrdersPayloadBuilder().withData([{
        id: "inv-1", invoice_number: "INV-001", status: "NEW"
    }]).build();

    // Intercept API request on demand and return an empty orders/invoices list
    await network.mockOrdersResponse(invoiceUrl, emptyOrdersPayload);
    //await network.mockJson(invoiceUrl, oneOrderPayload);//should fail

    await adminPageObjects.adminOrdersPage.openOrdersList();
    await adminPageObjects.adminOrdersPage.assertNoOrdersVisible();

    // Remove the mock, restore real network
    await network.unroute(invoiceUrl);
    await adminPageObjects.adminOrdersPage.openOrdersList();
    // now real orders are fetched from the server
});

test('Intercept response category/hand-tools to show only one tool', async ({ customerPage, customerPageObjects }) => {
    const network = new NetworkHelper(customerPage);
    const handToolUrl = "https://api.practicesoftwaretesting.com/products?page=1&by_category_slug=hand-tools";
    // Intercept API request on demand and return only one tool with new price.
    await network.mockOrdersResponse(handToolUrl, fakeHandToolsPayload);

    await customerPageObjects.categoryHandToolsPage.openCategoryHandTools();
    await customerPageObjects.categoryHandToolsPage.assertOnlyOneToolVisible();
});
