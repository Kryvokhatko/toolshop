"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_fixtures_1 = require("../../lib/fixtures/ui.fixtures");
const messageData_1 = require("../testData/messageData");
const test_1 = require("@playwright/test");
ui_fixtures_1.test.describe('Support Messaging Flow', { tag: ['@regression', '@ui'] }, () => {
    (0, ui_fixtures_1.test)('Full warranty support thread: customer opens, admin replies, customer closes', async ({ customerPageObjects, customerPage, adminPageObjects, }) => {
        const runId = Date.now();
        const customerFirstName = process.env.CUSTOMER_FIRST_NAME ?? 'Customer';
        const customerLastName = process.env.CUSTOMER_LAST_NAME ?? 'UniqueUser';
        const firstCustomerMessage = messageData_1.messageData.firstCustomerMessage();
        const firstAdminReply = messageData_1.messageData.firstAdminReply(runId, customerFirstName, customerLastName);
        const secondCustomerMessage = messageData_1.messageData.secondCustomerMessage(new Date(runId));
        const secondAdminReply = messageData_1.messageData.secondAdminReply(runId, customerFirstName, customerLastName);
        const thirdCustomerMessage = messageData_1.messageData.thirdCustomerMessage;
        // Customer sends message
        await customerPageObjects.contactPage.open();
        await customerPageObjects.contactPage.completeContactFormLoggedIn('warranty', firstCustomerMessage, 'info.txt');
        await customerPageObjects.contactPage.sendContactForm();
        await (0, test_1.expect)(customerPage.getByRole('alert')).toHaveText('Thanks for your message! We will contact you shortly.');
        await customerPageObjects.messagesPage.open('account');
        await customerPageObjects.messagesPage.customerOpensLatestMessage();
        await (0, test_1.expect)(customerPageObjects.messageDetails.messageDetailRoot).toContainText(firstCustomerMessage);
        const threadId = customerPageObjects.messageDetails.getCurrentMessageIdFromUrl();
        await customerPageObjects.messageDetails.assertMessageId(threadId);
        // Admin replies
        await adminPageObjects.messagesPage.open('admin');
        await adminPageObjects.messagesPage.opensMessageById(threadId);
        await adminPageObjects.messageDetails.assertMessageId(threadId);
        await adminPageObjects.messageDetails.changeStatus('IN_PROGRESS');
        await adminPageObjects.messageDetails.createReply(firstAdminReply);
        await adminPageObjects.messageDetails.sendReply(firstAdminReply, threadId);
        // Customer replies
        await customerPageObjects.messagesPage.open('account');
        await customerPageObjects.messagesPage.verifyStatus('IN_PROGRESS');
        await customerPageObjects.messagesPage.opensMessageById(threadId);
        await customerPageObjects.messageDetails.assertMessageId(threadId);
        await customerPageObjects.messageDetails.createReply(secondCustomerMessage);
        await customerPageObjects.messageDetails.sendReply(secondCustomerMessage, threadId);
        // Admin replies
        await adminPageObjects.messagesPage.open('admin');
        await adminPageObjects.messagesPage.opensMessageById(threadId);
        await adminPageObjects.messageDetails.assertMessageId(threadId);
        await adminPageObjects.messageDetails.createReply(secondAdminReply);
        await adminPageObjects.messageDetails.sendReply(secondAdminReply, threadId);
        // Customer sends final reply
        await customerPageObjects.messagesPage.open('account');
        await customerPageObjects.messagesPage.opensMessageById(threadId);
        await customerPageObjects.messageDetails.assertMessageId(threadId);
        await customerPageObjects.messageDetails.createReply(thirdCustomerMessage);
        await customerPageObjects.messageDetails.sendReply(thirdCustomerMessage, threadId);
        // Admin closes the ticket
        await adminPageObjects.messagesPage.open('admin');
        await adminPageObjects.messagesPage.opensMessageById(threadId);
        await adminPageObjects.messageDetails.assertMessageId(threadId);
        await adminPageObjects.messageDetails.changeStatus('RESOLVED');
        // Customer verifies the ticket is resolved
        await customerPageObjects.messagesPage.open('account');
        await customerPageObjects.messagesPage.verifyStatus('RESOLVED');
    });
});
