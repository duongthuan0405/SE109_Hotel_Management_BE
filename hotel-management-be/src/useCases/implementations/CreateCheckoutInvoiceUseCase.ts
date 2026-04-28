import { type ICreateCheckoutInvoiceUseCase, type CreateCheckoutInvoiceUCInput } from "../types/IInvoiceUseCases.js";
import { type Invoice, type InvoiceDetail } from "../../models/Invoice.js";
import { invoiceRepository, serviceUsageRepository } from "../../repository/index.js";
import { getPreviewInvoice } from "./GetPreviewInvoiceUseCase.js";
import { createInvoice } from "./CreateInvoiceUseCase.js";

export const createCheckoutInvoice: ICreateCheckoutInvoiceUseCase = {
  execute: async (input: CreateCheckoutInvoiceUCInput): Promise<Invoice> => {
    // 1. Get Preview data to auto-calculate roomTotal, serviceTotal, deposit, customerId
    const preview = await getPreviewInvoice.execute({ rentalSlipId: input.rentalSlipId });

    const customerId = input.customerId || preview.customerId;
    const roomTotal = input.roomTotal ?? preview.roomTotal;
    const deposit = input.deposit ?? preview.deposit;

    // 2. Build Invoice Details from Service Usages
    const serviceUsages = await serviceUsageRepository.findByRentalSlipIds([input.rentalSlipId], { service: true });
    const completedUsages = serviceUsages.filter(u => u.status === "Completed");

    const details: InvoiceDetail[] = [];
    
    // Add Room Line Item
    if (roomTotal > 0) {
      details.push({
        code: `CT-ROOM-${Date.now()}`,
        itemName: "Tiền phòng",
        quantity: 1, // Actually depends, but we just use 1 for lump sum
        unitPrice: roomTotal,
        totalAmount: roomTotal,
      });
    }

    let serviceTotal = 0;
    // Add Service Line Items
    completedUsages.forEach((usage, index) => {
      details.push({
        code: `CT-SVC-${Date.now()}-${index}`,
        itemName: usage.service?.name || `Dịch vụ ${usage.code}`,
        quantity: usage.quantity,
        unitPrice: usage.service?.price || (usage.totalAmount / usage.quantity),
        totalAmount: usage.totalAmount,
      });
      serviceTotal += usage.totalAmount;
    });

    // 3. Delegate to CreateInvoiceUseCase
    return await createInvoice.execute({
      rentalSlipId: input.rentalSlipId,
      cashierStaffId: input.cashierStaffId,
      customerId: customerId,
      paymentMethodId: input.paymentMethodId,
      roomTotal,
      serviceTotal,
      surcharge: input.surcharge,
      damageCharge: input.damageCharge,
      deposit,
      details,
    });
  },
};
