import { type ResetPasswordOTP } from "../../../models/ResetPasswordOTP.js";
import { type IResetPasswordOTPRepository } from "../../types/IResetPasswordOTPRepository.js";

let mockOTPs: ResetPasswordOTP[] = [];

const resetPasswordOTPRepository: IResetPasswordOTPRepository = {
  findByUserIdAndOtp: async (userId: string, otp: string): Promise<ResetPasswordOTP | null> => {
    const record = mockOTPs.find((r) => r.userId === userId && r.otp === otp);
    return record || null;
  },
  create: async (otpRecord: Omit<ResetPasswordOTP, "id">): Promise<ResetPasswordOTP> => {
    // Optional: remove old OTPs for this user before creating a new one
    mockOTPs = mockOTPs.filter(r => r.userId !== otpRecord.userId);
    
    const newRecord: ResetPasswordOTP = {
      ...otpRecord,
      id: Math.random().toString(36).substring(7),
    };
    mockOTPs.push(newRecord);
    return newRecord;
  },
  deleteByUserId: async (userId: string): Promise<void> => {
    mockOTPs = mockOTPs.filter(r => r.userId !== userId);
  },
};

export default resetPasswordOTPRepository;
