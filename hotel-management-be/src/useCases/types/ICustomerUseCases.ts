import { type IUseCase } from "./IUseCase.js";
import { type Customer } from "../../models/Customer.js";

export type CustomerUCOutput = Customer;

export type IGetAllCustomersUseCase = IUseCase<void, CustomerUCOutput[]>;

export type GetCustomerByIdUCInput = { id: string };
export type IGetCustomerByIdUseCase = IUseCase<GetCustomerByIdUCInput, CustomerUCOutput>;

export type GetCustomerByUserIdUCInput = { userId: string };
export type IGetCustomerByUserIdUseCase = IUseCase<GetCustomerByUserIdUCInput, CustomerUCOutput>;

export type CreateCustomerUCInput = {
  fullName: string;
  identityCard: string;
  phone: string;
  email: string;
  address?: string | undefined;
  userId?: string | undefined;
};
export type ICreateCustomerUseCase = IUseCase<CreateCustomerUCInput, CustomerUCOutput>;

export type UpdateCustomerUCInput = {
  id: string;
  fullName?: string | undefined;
  identityCard?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  address?: string | undefined;
};
export type IUpdateCustomerUseCase = IUseCase<UpdateCustomerUCInput, CustomerUCOutput>;

export type DeleteCustomerUCInput = { id: string };
export type IDeleteCustomerUseCase = IUseCase<DeleteCustomerUCInput, void>;
