import { type IUseCase } from "./IUseCase.js";
import { type Customer } from "../../models/Customer.js";

export type CustomerUCOutput = Customer;

export type IGetAllCustomersUseCase = IUseCase<void, CustomerUCOutput[]>;

export type GetCustomerByIdUCInput = { id: string };
export type IGetCustomerByIdUseCase = IUseCase<GetCustomerByIdUCInput, CustomerUCOutput>;

export type GetCustomerByUserIdUCInput = { userId: string };
export type IGetCustomerByUserIdUseCase = IUseCase<GetCustomerByUserIdUCInput, CustomerUCOutput>;

export type CreateCustomerUCInput = {
  HoTen: string;
  CMND: string;
  SDT: string;
  Email: string;
  DiaChi?: string | undefined;
  TaiKhoanId?: string | undefined;
};
export type ICreateCustomerUseCase = IUseCase<CreateCustomerUCInput, CustomerUCOutput>;

export type UpdateCustomerUCInput = {
  id: string;
  HoTen?: string | undefined;
  CMND?: string | undefined;
  SDT?: string | undefined;
  Email?: string | undefined;
  DiaChi?: string | undefined;
};
export type IUpdateCustomerUseCase = IUseCase<UpdateCustomerUCInput, CustomerUCOutput>;

export type DeleteCustomerUCInput = { id: string };
export type IDeleteCustomerUseCase = IUseCase<DeleteCustomerUCInput, void>;
