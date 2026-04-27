import {
  type ICreateRentalReceiptUseCase,
  type CreateRentalReceiptUCInput,
} from "../types/IRentalReceiptUseCases.js";
import { type RentalSlip } from "../../models/RentalSlip.js";
import { rentalReceiptRepository, roomRepository } from "../../repository/index.js";

export const createRentalReceipt: ICreateRentalReceiptUseCase = {
  execute: async (input: CreateRentalReceiptUCInput): Promise<RentalSlip> => {
    // 1. Check logic auto-generate MaPTP
    let slipCode = input.slipCode;
    if (!slipCode || slipCode.startsWith("PTP17")) {
      const count = await rentalReceiptRepository.countAll();
      slipCode = `PTP${String(count + 1).padStart(3, "0")}`;
    }

    // 2. Kiểm tra mã phiếu đã tồn tại chưa
    const existing = await rentalReceiptRepository.findBySlipCode(slipCode);
    if (existing) {
      throw new Error("Mã phiếu thuê phòng đã tồn tại");
    }

    // 3. Tạo phiếu mới
    const slip = await rentalReceiptRepository.create({
      slipCode,
      bookingId: input.bookingId,
      roomId: input.roomId,
      checkInDate: new Date(),
      expectedCheckOutDate: input.expectedCheckOutDate,
      actualGuestCount: input.actualGuestCount,
      adjustedPrice: input.adjustedPrice,
      checkInStaffId: input.checkInStaffId,
      status: "CheckedIn",
    });

    // 4. Cập nhật trạng thái phòng sang Occupied
    await roomRepository.updateStatus(input.roomId, "Occupied");

    return slip;
  },
};
