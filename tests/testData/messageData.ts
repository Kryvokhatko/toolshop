export const messageData = {
    subject: "warranty",
    attachment: "info.txt",
    firstCustomerMessage: () => `Hello, warranty help needed. Message must be minimal 50 characters`,
    firstAdminReply: (timestamp: number, firstName: string, lastName: string) => `Support reply id: ${timestamp}. Dear ${firstName} ${lastName}, please share invoice number and purchase date.`,
    secondCustomerMessage: (timestamp: Date) => `Invoice 001, purchase date ${timestamp.toISOString()}. Message must be minimal 50 characters`,
    secondAdminReply: (timestamp: number, firstName: string, lastName: string) => `Support reply id: ${timestamp}. Dear ${firstName} ${lastName}, your warranty is active and expires in 30 days. Can we close this query?`,
    thirdCustomerMessage: "Thank you, please close my query. Message must be minimal 50 characters",
};