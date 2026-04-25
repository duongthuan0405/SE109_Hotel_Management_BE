import { type IEmailService, type SendMailInput } from "../types/IEmailService.js";

const emailService: IEmailService = {
  sendMail: async (input: SendMailInput): Promise<void> => {
    console.log("-----------------------------------------");
    console.log(`[DEV EMAIL SENT to ${input.to}]`);
    console.log(`Subject: ${input.subject}`);
    console.log(`Text: ${input.text}`);
    console.log("-----------------------------------------");
  },
};

export default emailService;
