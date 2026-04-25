import { type IUseCase } from "./IUseCase.js";

export type LoginUCInput = {
  username: string;
  password: string;
};

export type LoginUCOutput = {
  token: string;
  role: string;
};

export type ILoginUseCase = IUseCase<LoginUCInput, LoginUCOutput>;
