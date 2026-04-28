import { type ICreatePaymentMethodUseCase, type CreatePaymentMethodUCInput } from "../types/IPaymentMethodUseCases.js";
import { type PaymentMethod } from "../../models/PaymentMethod.js";
import { paymentMethodRepository } from "../../repository/index.js";

export const createPaymentMethod: ICreatePaymentMethodUseCase = {
  execute: async (input: CreatePaymentMethodUCInput): Promise<PaymentMethod> => {
    const existing = await paymentMethodRepository.findByCode(input.code);
    if (existing) {
      throw { status: 409, message: "Mã phương thức thanh toán đã tồn tại" };
    }

    return await paymentMethodRepository.create({
      code: input.code,
      name: input.name,
    });
  },
};
