import { type ResetPasswordOTP } from "../../models/ResetPasswordOTP.js";

export type IResetPasswordOTPRepository = {
  findByUserIdAndOtp(userId: string, otp: string): Promise<ResetPasswordOTP | null>;
  create(otpRecord: Omit<ResetPasswordOTP, "id">): Promise<ResetPasswordOTP>;
  deleteByUserId(userId: string): Promise<void>;
};
