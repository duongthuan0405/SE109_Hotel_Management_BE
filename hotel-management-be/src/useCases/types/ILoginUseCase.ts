import { type IUseCase } from "@/useCases/types/IUseCase.js";

export type LoginUCInput = {
  username: string;
  password: string;
};

export type LoginUCOutput = {
  token: string;
  role: string;
};

export type ILoginUseCase = IUseCase<LoginUCInput, LoginUCOutput>;
