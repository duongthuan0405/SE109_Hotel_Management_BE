import {
  type ICheckOutUseCase,
  type CheckOutUCInput,
} from "../types/IRentalReceiptUseCases.js";
import { type RentalSlip } from "../../models/RentalSlip.js";
import { rentalReceiptRepository, roomRepository, bookingRepository } from "../../repository/index.js";
import { createBookingHistory as createBookingHistoryUseCase } from "./CreateBookingHistoryUseCase.js";

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

    // 2. Cập nhật trạng thái phòng sang Cleaning (Để dọn dẹp trước khi Available)
    await roomRepository.updateStatus(updated.roomId, "Cleaning");

    // 3. TỰ ĐỘNG HÓA: Kiểm tra và đóng Booking nếu là phòng cuối cùng
    if (updated.bookingId) {
      const allSlips = await rentalReceiptRepository.findByBookingId(updated.bookingId);
      const stillInRoom = allSlips.some(s => s.status === "CheckedIn");

      if (!stillInRoom) {
        const booking = await bookingRepository.findById(updated.bookingId);
        if (booking && booking.status !== "CheckedOut") {
          const oldStatus = booking.status;
          await bookingRepository.updateStatus(booking.id, "CheckedOut");

          // Ghi lịch sử tự động
          await createBookingHistoryUseCase.execute({
            code: `LSDP-CO-${Date.now()}`,
            bookingId: booking.id,
            oldStatus: oldStatus as any,
            newStatus: "CheckedOut",
            userId: input.executorUserId, // Sử dụng ID nhân viên truyền vào
          });
        }
      }
    }

    return updated;
  },
};
