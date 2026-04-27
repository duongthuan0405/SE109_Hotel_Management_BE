import {
  type ICreateRentalReceiptUseCase,
  type CreateRentalReceiptUCInput,
} from "../types/IRentalReceiptUseCases.js";
import { type RentalSlip } from "../../models/RentalSlip.js";
import { rentalReceiptRepository, roomRepository } from "../../repository/index.js";

export const createRentalReceipt: ICreateRentalReceiptUseCase = {
  execute: async (input: CreateRentalReceiptUCInput): Promise<RentalSlip> => {
    // 1. Luôn tự động sinh mã PTP từ Backend
    const count = await rentalReceiptRepository.countAll();
    const code = `PTP${String(count + 1).padStart(3, "0")}`;

    // 2. Tạo phiếu mới
    const slip = await rentalReceiptRepository.create({
      code,
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

    // 5. Trả về slip đã được populate để khớp với kết quả dự án cũ
    const populatedSlip = await rentalReceiptRepository.findById(slip.id, {
      booking: true,
      room: true,
      checkInStaff: true,
    });

    return populatedSlip!;
  },
};
