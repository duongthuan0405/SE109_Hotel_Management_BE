import { type IGetPreviewInvoiceUseCase, type GetPreviewInvoiceUCInput, type InvoicePreview } from "../types/IInvoiceUseCases.js";
import { rentalReceiptRepository, serviceUsageRepository, bookingRepository } from "../../repository/index.js";

export const getPreviewInvoice: IGetPreviewInvoiceUseCase = {
  execute: async (input: GetPreviewInvoiceUCInput): Promise<InvoicePreview> => {
    if (!input.bookingId) {
      throw { status: 400, message: "Thiếu ID Đơn đặt phòng" };
    }

    const booking = await bookingRepository.findById(input.bookingId, { customer: true });
    if (!booking) {
      throw { status: 404, message: "Không tìm thấy Đơn đặt phòng" };
    }

    // Lấy tất cả các phiếu thuê phòng thuộc đơn đặt phòng này
    const rentalSlips = await rentalReceiptRepository.findByBookingId(booking.id);
    
    let roomTotal = 0;

    // Tính toán tổng tiền phòng cho TOÀN BỘ phòng trong đơn đặt
    const startDate = booking.startDate.getTime();
    const endDate = booking.endDate.getTime();
    const bookedNights = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));

    if (rentalSlips.length > 0) {
      for (const slip of rentalSlips) {
        const rate = slip.adjustedPrice || 0;
        roomTotal += bookedNights * rate;
      }
    }

    // Tính tổng phí dịch vụ cho TOÀN BỘ phòng trong đơn đặt
    let serviceTotal = 0;
    if (rentalSlips.length > 0) {
      const slipIds = rentalSlips.map(s => s.id);
      const serviceUsages = await serviceUsageRepository.findByRentalSlipIds(slipIds);
      const completedUsages = serviceUsages.filter(u => u.status === "Completed");
      serviceTotal = completedUsages.reduce((sum, u) => sum + u.totalAmount, 0);
    }

    const deposit = booking.deposit || 0;

    return {
      customerId: booking.customerId,
      customerName: booking.customer?.fullName,
      roomTotal,
      serviceTotal,
      deposit,
      bookingId: booking.id,
    };
  },
};
