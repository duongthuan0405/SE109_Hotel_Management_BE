import { userRepository, userProfileRepository, resetPasswordOTPRepository } from "../../repository/index.js";
import { type IResetPasswordUseCase, type ResetPasswordUCInput, type ResetPasswordUCOutput } from "../types/IResetPasswordUseCase.js";
import { passwordService } from "../../services/index.js";

const resetPasswordUseCase: IResetPasswordUseCase = {
  execute: async (input: ResetPasswordUCInput): Promise<ResetPasswordUCOutput> => {
    const { email, otp, newPassword } = input;

    if (!email || !otp || !newPassword) {
      throw { status: 400, message: "Email, OTP và Mật khẩu mới là bắt buộc" };
    }

    if (newPassword.length < 6) {
      throw { status: 400, message: "Mật khẩu mới phải có ít nhất 6 ký tự" };
    }

    const profile = await userProfileRepository.findByEmail(email);
    if (!profile) {
      throw { status: 404, message: "Tài khoản không tồn tại" };
    }

    const otpRecord = await resetPasswordOTPRepository.findByUserIdAndOtp(profile.userId, otp);
    if (!otpRecord || otpRecord.expiresAt < Date.now()) {
      throw { status: 400, message: "Mã OTP không chính xác hoặc đã hết hạn" };
    }

    const user = await userRepository.findById(profile.userId);
    if (!user) {
      throw { status: 404, message: "Tài khoản không tồn tại" };
    }

    user.passwordHash = await passwordService.hashPassword(newPassword);
    await userRepository.save(user);
    
    await resetPasswordOTPRepository.deleteByUserId(user.id);

    return { message: "Mật khẩu đã được đặt lại thành công" };
  },
};

export default resetPasswordUseCase;
