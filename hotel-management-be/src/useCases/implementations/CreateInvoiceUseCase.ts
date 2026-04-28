import { type ICreateInvoiceUseCase, type CreateInvoiceUCInput } from "../types/IInvoiceUseCases.js";
import { type Invoice } from "../../models/Invoice.js";
import { invoiceRepository, rentalReceiptRepository, bookingRepository } from "../../repository/index.js";

export const createInvoice: ICreateInvoiceUseCase = {
  execute: async (input: CreateInvoiceUCInput): Promise<Invoice> => {
    // Generate Invoice Code if not provided
    let code = input.code;
    if (!code) {
      const count = await invoiceRepository.countAll();
      code = `HD${(count + 1).toString().padStart(3, "0")}`;
    }

    // Attempt auto-fill customer and deposit from rental slip's booking
    let customerId = input.customerId;
    let deposit = input.deposit ?? 0;
    
    if (input.rentalSlipId && (!customerId || deposit === 0)) {
      const rentalSlip = await rentalReceiptRepository.findById(input.rentalSlipId, { booking: true });
      if (rentalSlip?.booking) {
        if (!customerId) customerId = rentalSlip.booking.customerId;
        if (input.deposit === undefined) deposit = rentalSlip.booking.deposit;
      }
    }

    if (!customerId) {
      throw { status: 400, message: "Không xác định được Khách hàng" };
    }

    const roomTotal = input.roomTotal ?? 0;
    const serviceTotal = input.serviceTotal ?? 0;
    const surcharge = input.surcharge ?? 0;
    const damageCharge = input.damageCharge ?? 0;

    // TongThanhToan = TongTienPhong + TongTienDichVu + PhuThu + TienBoiThuong - TienDaCoc
    const grandTotal = Math.max(0, roomTotal + serviceTotal + surcharge + damageCharge - deposit);

    const invoice = await invoiceRepository.create({
      code,
      rentalSlipId: input.rentalSlipId,
      cashierStaffId: input.cashierStaffId,
      customerId,
      paymentMethodId: input.paymentMethodId,
      invoiceDate: new Date(),
      roomTotal,
      serviceTotal,
      surcharge,
      damageCharge,
      deposit,
      grandTotal,
      paymentStatus: "Paid", // Default to paid as per legacy
      details: input.details || [],
    });

    return invoice;
  },
};
