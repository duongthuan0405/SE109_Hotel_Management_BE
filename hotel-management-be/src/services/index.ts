import passwordServiceImpl from "./implementations/PasswordService.js";
import jwtServiceImpl from "./implementations/JwtService.js";
import emailServiceImpl from "./implementations/EmailService.js";
import otpServiceImpl from "./implementations/OtpService.js";
import momoServiceImpl from "./implementations/MomoService.js";

export const passwordService = passwordServiceImpl;
export const jwtService = jwtServiceImpl;
export const emailService = emailServiceImpl;
export const otpService = otpServiceImpl;
export const momoService = momoServiceImpl;
