import { type IUseCase } from "./IUseCase.js";

export type ForgotPasswordUCInput = {
  email: string;
};

export type ForgotPasswordUCOutput = {
  message: string;
  otp?: string;
};

export type IForgotPasswordUseCase = IUseCase<ForgotPasswordUCInput, ForgotPasswordUCOutput>;
