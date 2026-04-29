import { type IGetAllPaymentMethodsUseCase } from "../types/IPaymentMethodUseCases.js";
import { type PaymentMethod } from "../../models/PaymentMethod.js";
import { paymentMethodRepository } from "../../repository/index.js";

export const getAllPaymentMethods: IGetAllPaymentMethodsUseCase = {
  execute: async (): Promise<PaymentMethod[]> => {
    return await paymentMethodRepository.findAll();
  },
};
