import loginUseCaseImpl from "./implementations/LoginUseCase.js";
import registerUseCaseImpl from "./implementations/RegisterUseCase.js";
import forgotPasswordUseCaseImpl from "./implementations/ForgotPasswordUseCase.js";
import resetPasswordUseCaseImpl from "./implementations/ResetPasswordUseCase.js";

export const loginUseCase = loginUseCaseImpl;
export const registerUseCase = registerUseCaseImpl;
export const forgotPasswordUseCase = forgotPasswordUseCaseImpl;
export const resetPasswordUseCase = resetPasswordUseCaseImpl;
