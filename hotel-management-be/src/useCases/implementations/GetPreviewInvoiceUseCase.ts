import { type IGetPreviewInvoiceUseCase, type GetPreviewInvoiceUCInput, type InvoicePreview } from "../types/IInvoiceUseCases.js";
import { bookingRepository, serviceUsageRepository, settingsRepository, rentalReceiptRepository } from "../../repository/index.js";

export const getPreviewInvoice: IGetPreviewInvoiceUseCase = {
  execute: async (input: GetPreviewInvoiceUCInput): Promise<InvoicePreview> => {
    if (!input.bookingId) {
      throw { status: 400, message: "Thiếu ID Đơn đặt phòng" };
    }

    let booking = await bookingRepository.findById(input.bookingId, { rentalSlips: true, customer: true });
    
    // Fallback: Nếu không tìm thấy bằng bookingId, thử tìm bằng rentalSlipId
    if (!booking) {
      const slip = await rentalReceiptRepository.findById(input.bookingId);
      if (slip) {
        booking = await bookingRepository.findById(slip.bookingId, { rentalSlips: true, customer: true });
      }
    }

    if (!booking) {
      throw { status: 404, message: "Không tìm thấy Đơn đặt phòng" };
    }

    let roomTotal = 0;
    let serviceTotal = 0;
    const slips = booking.rentalSlips || [];

    // 1. Tính tổng tiền phòng của tất cả các Phiếu thuê
    for (const slip of slips) {
      let rate = slip.adjustedPrice;

      // Fallback nếu không có giá điều chỉnh
      if (!rate || rate <= 0) {
        const settings = await settingsRepository.findByKey("GeneralSettings");
        if (settings) {
          const basePrices = settings.baseRoomPrices as Record<string, number>;
          rate = basePrices[booking.roomClass] || 0;
        }
      }

      const startDate = booking.startDate.getTime();
      const endDate = booking.endDate.getTime();
      const bookedNights = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));

      roomTotal += bookedNights * rate;
    }

    // 2. Tính tổng tiền dịch vụ của tất cả các Phiếu thuê
    const slipIds = slips.map(s => s.id);
    if (slipIds.length > 0) {
      const serviceUsages = await serviceUsageRepository.findByRentalSlipIds(slipIds);
      serviceTotal = serviceUsages
        .filter(u => u.status === "Completed")
        .reduce((sum, u) => sum + u.totalAmount, 0);
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

