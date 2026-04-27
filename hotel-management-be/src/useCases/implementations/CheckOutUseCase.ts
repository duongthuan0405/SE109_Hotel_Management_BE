import {
  type ICheckOutUseCase,
  type CheckOutUCInput,
} from "../types/IRentalReceiptUseCases.js";
import { type RentalSlip } from "../../models/RentalSlip.js";
import { rentalReceiptRepository, roomRepository } from "../../repository/index.js";

export const checkOut: ICheckOutUseCase = {
  execute: async (input: CheckOutUCInput): Promise<RentalSlip> => {
    // 1. Cập nhật trạng thái phiếu sang CheckedOut
    const updated = await rentalReceiptRepository.update(input.id, {
      status: "CheckedOut",
    }, {
      booking: true,
      room: true,
      checkInStaff: true,
    });

    if (!updated) {
      throw { status: 404, message: "Phiếu thuê phòng không tồn tại" };
    }

    // 2. Cập nhật trạng thái phòng sang Available
    await roomRepository.updateStatus(updated.roomId, "Available");

    return updated;
  },
};
