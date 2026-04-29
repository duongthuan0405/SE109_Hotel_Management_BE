import { type ICreateInvoiceUseCase, type CreateInvoiceUCInput } from "../types/IInvoiceUseCases.js";
import { type Invoice } from "../../models/Invoice.js";
import { invoiceRepository, rentalReceiptRepository, staffRepository } from "../../repository/index.js";

export const createInvoice: ICreateInvoiceUseCase = {
  execute: async (input: CreateInvoiceUCInput): Promise<Invoice> => {
    // 1. Tìm Staff từ UserID
    const staff = await staffRepository.findByUserId(input.cashierUserId);
    if (!staff) {
      throw { status: 403, message: "Nhân viên thực hiện không tồn tại" };
    }

    // 3. Tự động điền thông tin (giữ nguyên)
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
      rentalSlipId: input.rentalSlipId,
      cashierStaffId: staff.id, // Dùng ID Staff đã tìm thấy
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

    // Populate để Controller mapping đúng object
    const populated = await invoiceRepository.findById(invoice.id, {
      cashierStaff: true,
      customer: true,
      paymentMethod: true,
      rentalSlip: true,
    });

    return populated!;
  },
};

export default createInvoice;
