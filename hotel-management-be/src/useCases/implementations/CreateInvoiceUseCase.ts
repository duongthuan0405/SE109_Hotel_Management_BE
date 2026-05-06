import { type ICreateInvoiceUseCase, type CreateInvoiceUCInput } from "../types/IInvoiceUseCases.js";
import { type Invoice } from "../../models/Invoice.js";
import { invoiceRepository, bookingRepository, staffRepository } from "../../repository/index.js";

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
    
    let bookingId = input.bookingId;
    if (bookingId && (!customerId || deposit === 0)) {
      let booking = await bookingRepository.findById(bookingId);
      
      if (!booking) {
        // Hỗ trợ tìm Booking từ RentalSlipId
        const { rentalReceiptRepository } = await import("../../repository/index.js");
        const slip = await rentalReceiptRepository.findById(bookingId);
        if (slip) {
          bookingId = slip.bookingId;
          booking = await bookingRepository.findById(bookingId);
        }
      }

      if (booking) {
        if (!customerId) customerId = booking.customerId;
        if (input.deposit === undefined) deposit = booking.deposit;
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
      bookingId: bookingId as string,
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
      booking: true,
      details: true,
    });


    return populated!;
  },
};

export default createInvoice;
