import env from "../../config/env.js";
import { type IOtpService, type GeneratedOTP } from "../types/IOtpService.js";

const otpService: IOtpService = {
  generateOTP: (): GeneratedOTP => {
    const length = env.OTP_LENGTH;
    const durationInMinutes = env.OTP_DURATION_IN_MINUTES;

    let otp = "";
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }

    const expiresAt = Date.now() + durationInMinutes * 60 * 1000;

    return {
      otp,
      expiresAt,
    };
  },
};

export default otpService;
