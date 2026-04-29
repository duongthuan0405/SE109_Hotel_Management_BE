import { type IUseCase } from "./IUseCase.js";
import { type PaymentMethod } from "../../models/PaymentMethod.js";

export type CreatePaymentMethodUCInput = {
  name: string;
};
export type ICreatePaymentMethodUseCase = IUseCase<CreatePaymentMethodUCInput, PaymentMethod>;

export type IGetAllPaymentMethodsUseCase = IUseCase<{}, PaymentMethod[]>;

export type GetPaymentMethodByIdUCInput = { id: string };
export type IGetPaymentMethodByIdUseCase = IUseCase<GetPaymentMethodByIdUCInput, PaymentMethod>;

export type UpdatePaymentMethodUCInput = {
  id: string;
  name: string;
};
export type IUpdatePaymentMethodUseCase = IUseCase<UpdatePaymentMethodUCInput, PaymentMethod>;

export type DeletePaymentMethodUCInput = { id: string };
export type IDeletePaymentMethodUseCase = IUseCase<DeletePaymentMethodUCInput, PaymentMethod>;
