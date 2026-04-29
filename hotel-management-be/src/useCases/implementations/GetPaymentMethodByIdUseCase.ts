import { type IGetPaymentMethodByIdUseCase, type GetPaymentMethodByIdUCInput } from "../types/IPaymentMethodUseCases.js";
import { type PaymentMethod } from "../../models/PaymentMethod.js";
import { paymentMethodRepository } from "../../repository/index.js";

export const getPaymentMethodById: IGetPaymentMethodByIdUseCase = {
  execute: async (input: GetPaymentMethodByIdUCInput): Promise<PaymentMethod> => {
    const method = await paymentMethodRepository.findById(input.id);
    if (!method) {
      throw { status: 404, message: "Phương thức thanh toán không tồn tại" };
    }
    return method;
  },
};
