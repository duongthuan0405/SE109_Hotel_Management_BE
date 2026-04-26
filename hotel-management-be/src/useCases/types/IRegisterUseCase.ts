import { type IUseCase } from "./IUseCase.js";

export type RegisterUCInput = {
  username: string;
  password: string;
  fullName?: string;
  identityCard?: string;
  phone?: string;
  email?: string;
  address?: string;
};

export type RegisterUCOutput = {
  id: string;
  username: string;
  role: string;
};

export type IRegisterUseCase = IUseCase<RegisterUCInput, RegisterUCOutput>;
