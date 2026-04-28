import { type IDeleteInvoiceUseCase, type DeleteInvoiceUCInput } from "../types/IInvoiceUseCases.js";
import { type Invoice } from "../../models/Invoice.js";
import { invoiceRepository } from "../../repository/index.js";

export const deleteInvoice: IDeleteInvoiceUseCase = {
  execute: async (input: DeleteInvoiceUCInput): Promise<Invoice> => {
    const invoice = await invoiceRepository.findById(input.id);
    if (!invoice) {
      throw { status: 404, message: "Không tìm thấy Hóa đơn" };
    }
    
    await invoiceRepository.delete(input.id);
    return invoice;
  },
};
