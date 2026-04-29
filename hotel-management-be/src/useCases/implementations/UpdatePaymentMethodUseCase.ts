import { type IUpdatePaymentMethodUseCase, type UpdatePaymentMethodUCInput } from "../types/IPaymentMethodUseCases.js";
import { type PaymentMethod } from "../../models/PaymentMethod.js";
import { paymentMethodRepository } from "../../repository/index.js";

export const updatePaymentMethod: IUpdatePaymentMethodUseCase = {
  execute: async (input: UpdatePaymentMethodUCInput): Promise<PaymentMethod> => {
    const updated = await paymentMethodRepository.update(input.id, { name: input.name });
    if (!updated) {
      throw { status: 404, message: "Phương thức thanh toán không tồn tại" };
    }
    return updated;
  },
};
