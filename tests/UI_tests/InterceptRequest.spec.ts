import { test } from "../../lib/fixtures/ui.fixtures";
import { NetworkHelper } from "../../lib/utils/networkHelper";

const fakeOrdersPayload = {
    current_page: 1,
    data: [],
    from: 1,
    last_page: 1,
    per_page: 15,
    to: 15,
    total: 0
};

test('Intercept request Admin/Orders', async ({ adminPage, adminPageObjects }) => {
    const network = new NetworkHelper(adminPage);
    // Intercept API request on demand and return an empty orders/invoices list.
    await network.mockJson("https://api.practicesoftwaretesting.com/invoices?page=1", fakeOrdersPayload);

    await adminPageObjects.adminOrdersPage.openOrdersList();
    await adminPageObjects.adminOrdersPage.assertNoOrdersVisible();
});