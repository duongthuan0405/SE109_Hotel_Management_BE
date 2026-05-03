import { type IGetInvoiceByIdUseCase, type GetInvoiceByIdUCInput } from "../types/IInvoiceUseCases.js";
import { type Invoice } from "../../models/Invoice.js";
import { invoiceRepository } from "../../repository/index.js";

export const getInvoiceById: IGetInvoiceByIdUseCase = {
  execute: async (input: GetInvoiceByIdUCInput): Promise<Invoice> => {
    const invoice = await invoiceRepository.findById(input.id, {
      rentalSlip: true,
      cashierStaff: true,
      customer: true,
      paymentMethod: true,
      details: true,
    });
    if (!invoice) {
      throw { status: 404, message: "Không tìm thấy Hóa đơn" };
    }
    return invoice;
  },
};
