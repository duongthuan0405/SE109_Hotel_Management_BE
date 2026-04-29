import { type IGetAllInvoicesUseCase } from "../types/IInvoiceUseCases.js";
import { type Invoice } from "../../models/Invoice.js";
import { invoiceRepository } from "../../repository/index.js";

export const getAllInvoices: IGetAllInvoicesUseCase = {
  execute: async (): Promise<Invoice[]> => {
    return await invoiceRepository.findAll({
      rentalSlip: true,
      cashierStaff: true,
      customer: true,
      paymentMethod: true,
    });
  },
};
