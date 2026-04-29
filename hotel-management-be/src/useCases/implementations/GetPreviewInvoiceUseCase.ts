import { type IGetPreviewInvoiceUseCase, type GetPreviewInvoiceUCInput, type InvoicePreview } from "../types/IInvoiceUseCases.js";
import { rentalReceiptRepository, serviceUsageRepository, settingsRepository } from "../../repository/index.js";

export const getPreviewInvoice: IGetPreviewInvoiceUseCase = {
  execute: async (input: GetPreviewInvoiceUCInput): Promise<InvoicePreview> => {
    if (!input.rentalSlipId) {
      throw { status: 400, message: "Thiếu ID Phiếu thuê phòng" };
    }

    const rentalSlip = await rentalReceiptRepository.findById(input.rentalSlipId, { booking: true });
    if (!rentalSlip) {
      throw { status: 404, message: "Không tìm thấy Phiếu thuê phòng" };
    }

    const booking = rentalSlip.booking;
    let roomTotal = 0;

    // Calculate room total
    if (booking) {
      // 1. rate = rentalSlip.adjustedPrice (ưu tiên)
      let rate = rentalSlip.adjustedPrice;

      // 2. Fallback: settings.baseRoomPrices[booking.roomClass]
      if (!rate || rate <= 0) {
        const settings = await settingsRepository.findByKey("GeneralSettings");
        if (settings) {
          const basePrices = settings.baseRoomPrices as Record<string, number>;
          rate = basePrices[booking.roomClass] || 0;
        }
      }

      // 3. bookedNights = ceil((endDate - startDate) / 1 ngày), tối thiểu 1
      // CRITICAL BUSINESS RULE: Price based on BOOKED duration, NOT actual stay
      const startDate = booking.startDate.getTime();
      const endDate = booking.endDate.getTime();
      const bookedNights = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));

      roomTotal = bookedNights * rate;
    }

    // Calculate service total
    const serviceUsages = await serviceUsageRepository.findByRentalSlipIds([rentalSlip.id]);
    const completedUsages = serviceUsages.filter(u => u.status === "Completed");
    const serviceTotal = completedUsages.reduce((sum, u) => sum + u.totalAmount, 0);

    const deposit = booking?.deposit || 0;

    return {
      customerId: booking?.customerId,
      customerName: booking?.customer?.fullName, // we might not have it populated deep, but it matches legacy return type
      roomTotal,
      serviceTotal,
      deposit,
      rentalSlipId: rentalSlip.id,
    };
  },
};
