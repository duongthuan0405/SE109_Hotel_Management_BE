import { type IUseCase } from "./IUseCase.js";

export type ResetPasswordUCInput = {
  email: string;
  otp: string;
  newPassword: string;
};

export type ResetPasswordUCOutput = {
  message: string;
};

export type IResetPasswordUseCase = IUseCase<ResetPasswordUCInput, ResetPasswordUCOutput>;
