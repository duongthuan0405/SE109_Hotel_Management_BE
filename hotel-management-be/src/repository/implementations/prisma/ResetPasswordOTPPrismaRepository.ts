import { type ResetPasswordOTP } from "../../../models/ResetPasswordOTP.js";
import { type IResetPasswordOTPRepository } from "../../types/IResetPasswordOTPRepository.js";
import prisma from "../../../config/prisma.js";

const mapToEntity = (otp: any): ResetPasswordOTP => ({
  id: otp.id,
  userId: otp.userId,
  otp: otp.otp,
  expiredAt: otp.expiredAt,
});

const resetPasswordOTPPrismaRepository: IResetPasswordOTPRepository = {
  create: async (otp: Omit<ResetPasswordOTP, "id">): Promise<ResetPasswordOTP> => {
    const newOtp = await prisma.resetPasswordOTP.create({
      data: {
        userId: otp.userId,
        otp: otp.otp,
        expiredAt: otp.expiredAt,
      },
    });
    return mapToEntity(newOtp);
  },

  findByUserIdAndOtp: async (userId: string, otp: string): Promise<ResetPasswordOTP | null> => {
    const found = await prisma.resetPasswordOTP.findFirst({
      where: {
        userId,
        otp,
        expiredAt: {
          gt: new Date(),
        },
      },
    });
    return found ? mapToEntity(found) : null;
  },

  deleteByUserId: async (userId: string): Promise<void> => {
    await prisma.resetPasswordOTP.deleteMany({
      where: { userId },
    });
  },
};

export default resetPasswordOTPPrismaRepository;
