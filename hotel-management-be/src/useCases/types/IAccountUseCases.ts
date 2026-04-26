import { type IUseCase } from "./IUseCase.js";
import { type User } from "../../models/User.js";

export type AccountUCOutput = Omit<User, "passwordHash"> & {
  fullName?: string;
  identityCard?: string;
  phone?: string;
  email?: string;
  address?: string;
};

export type IGetAllAccountsUseCase = IUseCase<void, AccountUCOutput[]>;

export type GetAccountByIdUCInput = { id: string };
export type IGetAccountByIdUseCase = IUseCase<GetAccountByIdUCInput, AccountUCOutput>;

export type CreateAccountUCInput = {
  username: string;
  password: string;
  role: string;
};
export type ICreateAccountUseCase = IUseCase<CreateAccountUCInput, AccountUCOutput>;

export type UpdateAccountUCInput = {
  id: string;
  fullName?: string;
  identityCard?: string;
  phone?: string;
  email?: string;
  address?: string;
  role?: string;
};
export type IUpdateAccountUseCase = IUseCase<UpdateAccountUCInput, AccountUCOutput>;

export type ChangePasswordUCInput = {
  id: string;
  oldPassword: string;
  newPassword: string;
};
export type IChangePasswordUseCase = IUseCase<ChangePasswordUCInput, void>;

export type DeleteAccountUCInput = { id: string };
export type IDeleteAccountUseCase = IUseCase<DeleteAccountUCInput, void>;
