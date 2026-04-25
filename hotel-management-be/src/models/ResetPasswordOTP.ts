export type ResetPasswordOTP = {
  id: string;
  userId: string;
  otp: string;
  expiresAt: number;
};
