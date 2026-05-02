export type GeneratedOTP = {
  otp: string;
  expiredAt: Date;
};

export type IOtpService = {
  generateOTP(): GeneratedOTP;
};
