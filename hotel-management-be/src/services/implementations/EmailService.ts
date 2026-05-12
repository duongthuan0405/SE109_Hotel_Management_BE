import nodemailer from 'nodemailer';
import env from '../../config/env.js';
import { type IEmailService, type SendMailInput } from "../types/IEmailService.js";

// Create a transporter using Gmail service or other SMTP settings from environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

const emailService: IEmailService = {
  sendMail: async (input: SendMailInput): Promise<void> => {
    // Log email details in non-production environments for debugging
    if (env.NODE_ENV !== 'production') {
      console.log("-----------------------------------------");
      console.log(`[EMAIL SENDING to ${input.to}]`);
      console.log(`Subject: ${input.subject}`);
      console.log("-----------------------------------------");
    }

    // KHÔNG gửi mail thật nếu đang chạy test để tránh tốn quota hoặc spam
    if (env.NODE_ENV === 'test') {
      return;
    }

    try {
      await transporter.sendMail({
        from: `"Hotel Management" <${env.EMAIL_USER}>`,
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html,
      });

      if (env.NODE_ENV !== 'production') {
        console.log(`[EMAIL SENT SUCCESSFULLY to ${input.to}]`);
      }
    } catch (error) {
      console.error("[EMAIL ERROR]:", error);
      // In production, we throw the error to be handled by the caller or global error handler
      if (env.NODE_ENV === 'production') {
        throw { status: 500, message: "Gửi email thất bại" };
      }
    }
  },
};

export default emailService;

