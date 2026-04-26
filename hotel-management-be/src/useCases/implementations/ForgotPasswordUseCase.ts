import { staffRepository, customerRepository, resetPasswordOTPRepository } from "../../repository/index.js";
import { type IForgotPasswordUseCase, type ForgotPasswordUCInput, type ForgotPasswordUCOutput } from "../types/IForgotPasswordUseCase.js";
import { emailService, otpService } from "../../services/index.js";
import env from "../../config/env.js";

const forgotPasswordUseCase: IForgotPasswordUseCase = {
  execute: async (input: ForgotPasswordUCInput): Promise<ForgotPasswordUCOutput> => {
    const { email } = input;
    if (!email) {
      throw { status: 400, message: "Email là bắt buộc" };
    }

    // Tìm kiếm trong cả Staff (Nhân viên) và Customer (Khách hàng)
    let userId: string | undefined;
    
    const staff = await staffRepository.findByEmail(email);
    if (staff) {
      userId = staff.userId;
    } else {
      const customer = await customerRepository.findByEmail(email);
      if (customer) {
        userId = customer.userId;
      }
    }

    if (!userId) {
      throw { status: 404, message: "Không tìm thấy tài khoản với email này" };
    }

    const generatedOtp = otpService.generateOTP();
    await resetPasswordOTPRepository.create({
      userId: userId,
      otp: generatedOtp.otp,
      expiresAt: generatedOtp.expiresAt,
    });

    const emailSubject = "Mã xác thực đặt lại mật khẩu";
    const emailText = `Mã OTP của bạn là: ${generatedOtp.otp}. Mã có hiệu lực trong ${env.OTP_DURATION_IN_MINUTES} phút.`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333;">Đặt lại mật khẩu</h2>
        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản tại <strong>Hotel Management System</strong>.</p>
        <p>Mã xác thực (OTP) của bạn là:</p>
        <div style="font-size: 24px; font-weight: bold; color: #d90429; letter-spacing: 5px; margin: 20px 0;">
          ${generatedOtp.otp}
        </div>
        <p>Mã này sẽ hết hạn sau <strong>${env.OTP_DURATION_IN_MINUTES} phút</strong>.</p>
        <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
      </div>
    `;

    await emailService.sendMail({
      to: email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    return { message: "Email simulation (check server console for OTP code)", otp: generatedOtp.otp };
  },
};

export default forgotPasswordUseCase;
