import { test, expect } from "../lib/fixtures/ui.fixtures";
import { messageData } from "./testData/messageData";

test("Support flow for warranty @E2E", async ({ customerPageObjects, customerPage, adminPageObjects }) => {
    const runId = Date.now();
    const customerFirstName = process.env.CUSTOMER_FIRST_NAME ?? 'Customer';
    const customerLastName = process.env.CUSTOMER_LAST_NAME ?? 'UniqueUser';
    const firstCustomerMessage = messageData.firstCustomerMessage();
    const firstAdminReply = messageData.firstAdminReply(runId, customerFirstName, customerLastName);
    const secondCustomerMessage = messageData.secondCustomerMessage(new Date(runId));
    const secondAdminReply = messageData.secondAdminReply(runId, customerFirstName, customerLastName);
    const thirdCustomerMessage = messageData.thirdCustomerMessage;
    
    //Customer sends message
    await customerPageObjects.contactPage.open();
    await customerPageObjects.contactPage.completeContactFormLoggedIn("warranty", firstCustomerMessage, "info.txt");
    await customerPageObjects.contactPage.sendContactForm();
    await expect(customerPage.getByRole("alert")).toHaveText("Thanks for your message! We will contact you shortly.");
    await customerPageObjects.messagesPage.open("account");
    await customerPageObjects.messagesPage.customerOpensLatestMessage();
    await expect(customerPageObjects.messageDetails.messageDetailRoot).toContainText(firstCustomerMessage);
    const threadId = customerPageObjects.messageDetails.getCurrentMessageIdFromUrl();
    await customerPageObjects.messageDetails.assertMessageId(threadId);
    
    // Admin replies
    await adminPageObjects.messagesPage.open("admin");
    await adminPageObjects.messagesPage.opensMessageById(threadId);
    await adminPageObjects.messageDetails.assertMessageId(threadId);
    await adminPageObjects.messageDetails.changeStatus("IN_PROGRESS");
    await adminPageObjects.messageDetails.createReply(firstAdminReply);
    await adminPageObjects.messageDetails.sendReply(firstAdminReply, threadId);

    // Customer replies
    await customerPageObjects.messagesPage.open("account");
    await customerPageObjects.messagesPage.verifyStatus("IN_PROGRESS");
    await customerPageObjects.messagesPage.opensMessageById(threadId);
    await customerPageObjects.messageDetails.assertMessageId(threadId);
    await customerPageObjects.messageDetails.createReply(secondCustomerMessage);
    await customerPageObjects.messageDetails.sendReply(secondCustomerMessage, threadId);
    
    // Admin replies
    await adminPageObjects.messagesPage.open("admin");
    await adminPageObjects.messagesPage.opensMessageById(threadId);
    await adminPageObjects.messageDetails.assertMessageId(threadId);
    await adminPageObjects.messageDetails.createReply(secondAdminReply);
    await adminPageObjects.messageDetails.sendReply(secondAdminReply, threadId);
    
    // Customer replies
    await customerPageObjects.messagesPage.open("account");
    await customerPageObjects.messagesPage.opensMessageById(threadId);
    await customerPageObjects.messageDetails.assertMessageId(threadId);
    await customerPageObjects.messageDetails.createReply(thirdCustomerMessage);
    await customerPageObjects.messageDetails.sendReply(thirdCustomerMessage, threadId);

    // Admin closes query
    await adminPageObjects.messagesPage.open("admin");
    await adminPageObjects.messagesPage.opensMessageById(threadId);
    await adminPageObjects.messageDetails.assertMessageId(threadId);
    await adminPageObjects.messageDetails.changeStatus("RESOLVED");

    //Customer can see his message with status "RESOLVED"
    await customerPageObjects.messagesPage.open("account");
    await customerPageObjects.messagesPage.verifyStatus("RESOLVED");
});