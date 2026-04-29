import { type IUpdateInvoiceUseCase, type UpdateInvoiceUCInput } from "../types/IInvoiceUseCases.js";
import { type Invoice } from "../../models/Invoice.js";
import { invoiceRepository } from "../../repository/index.js";

export const updateInvoice: IUpdateInvoiceUseCase = {
  execute: async (input: UpdateInvoiceUCInput): Promise<Invoice> => {
    const updated = await invoiceRepository.update(input.id, {
      ...(input.paymentStatus && { paymentStatus: input.paymentStatus }),
    });

    if (!updated) {
      throw { status: 404, message: "Không tìm thấy Hóa đơn" };
    }

    return updated;
  },
};
