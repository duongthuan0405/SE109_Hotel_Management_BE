import { type IDeletePaymentMethodUseCase, type DeletePaymentMethodUCInput } from "../types/IPaymentMethodUseCases.js";
import { type PaymentMethod } from "../../models/PaymentMethod.js";
import { paymentMethodRepository } from "../../repository/index.js";

export const deletePaymentMethod: IDeletePaymentMethodUseCase = {
  execute: async (input: DeletePaymentMethodUCInput): Promise<PaymentMethod> => {
    const method = await paymentMethodRepository.findById(input.id);
    if (!method) {
      throw { status: 404, message: "Phương thức thanh toán không tồn tại" };
    }
    await paymentMethodRepository.delete(input.id);
    return method;
  },
};
