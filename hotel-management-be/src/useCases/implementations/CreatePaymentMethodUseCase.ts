import { type ICreatePaymentMethodUseCase, type CreatePaymentMethodUCInput } from "../types/IPaymentMethodUseCases.js";
import { type PaymentMethod } from "../../models/PaymentMethod.js";
import { paymentMethodRepository } from "../../repository/index.js";

export const createPaymentMethod: ICreatePaymentMethodUseCase = {
  execute: async (input: CreatePaymentMethodUCInput): Promise<PaymentMethod> => {
    return await paymentMethodRepository.create({
      name: input.name,
    });
  },
};
