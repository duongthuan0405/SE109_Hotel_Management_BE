export type GeneratedOTP = {
  otp: string;
  expiresAt: number;
};

export type IOtpService = {
  generateOTP(): GeneratedOTP;
};
