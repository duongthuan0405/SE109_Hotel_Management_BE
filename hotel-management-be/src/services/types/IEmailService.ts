export type SendMailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export type IEmailService = {
  sendMail(input: SendMailInput): Promise<void>;
};
