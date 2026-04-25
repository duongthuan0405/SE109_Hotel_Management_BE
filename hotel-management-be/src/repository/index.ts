import userRepositoryImpl from "./implementations/UserRepository.js";
import userProfileRepositoryImpl from "./implementations/UserProfileRepository.js";
import resetPasswordOTPRepositoryImpl from "./implementations/ResetPasswordOTPRepository.js";

export const userRepository = userRepositoryImpl;
export const userProfileRepository = userProfileRepositoryImpl;
export const resetPasswordOTPRepository = resetPasswordOTPRepositoryImpl;
