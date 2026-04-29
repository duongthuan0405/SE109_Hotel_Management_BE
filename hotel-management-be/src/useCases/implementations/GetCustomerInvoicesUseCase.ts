import { type IGetCustomerInvoicesUseCase, type GetCustomerInvoicesUCInput } from "../types/IInvoiceUseCases.js";
import { type Invoice } from "../../models/Invoice.js";
import { invoiceRepository, customerRepository } from "../../repository/index.js";

export const getCustomerInvoices: IGetCustomerInvoicesUseCase = {
  execute: async (input: GetCustomerInvoicesUCInput): Promise<Invoice[]> => {
    const customer = await customerRepository.findByUserId(input.userId);
    if (!customer) {
      return [];
    }

    return await invoiceRepository.findByCustomerId(customer.id, {
      rentalSlip: true,
      cashierStaff: true,
      customer: true,
      paymentMethod: true,
    });
  },
};

export default getCustomerInvoices;
