import {
  type ICreateRentalReceiptUseCase,
  type CreateRentalReceiptUCInput,
} from "../types/IRentalReceiptUseCases.js";
import { type RentalSlip } from "../../models/RentalSlip.js";
import { rentalReceiptRepository, roomRepository, bookingRepository, staffRepository, unitOfWork } from "../../repository/index.js";
import { createBookingHistory as createBookingHistoryUseCase } from "./CreateBookingHistoryUseCase.js";

export const createRentalReceipt: ICreateRentalReceiptUseCase = {
  execute: async (input: CreateRentalReceiptUCInput): Promise<RentalSlip> => {
    return await unitOfWork.runInTransaction(async () => {
      // 1. Tìm Staff từ UserID (Mapping ở UseCase)
      const staff = await staffRepository.findByUserId(input.checkInStaffUserId);
      if (!staff) {
        throw { status: 403, message: "Nhân viên thực hiện không tồn tại" };
      }

      // 2. Tìm Booking để lấy số khách mặc định
      const booking = await bookingRepository.findById(input.bookingId);
      if (!booking) {
        throw { status: 404, message: "Đơn đặt phòng không tồn tại" };
      }

      // 3. Tạo phiếu mới (Mã PTP được Repo tự sinh)
      const slip = await rentalReceiptRepository.create({
        bookingId: input.bookingId,
        roomId: input.roomId,
        checkInDate: new Date(),
        expectedCheckOutDate: input.expectedCheckOutDate,
        adjustedPrice: input.adjustedPrice,
        checkInStaffId: staff.id, // Dùng Staff ID vừa tìm được
        status: "CheckedIn",
      });

      // 4. Cập nhật trạng thái phòng sang Occupied
      await roomRepository.updateStatus(input.roomId, "Occupied");

      // 5. TỰ ĐỘNG HÓA: Cập nhật trạng thái Booking và ghi lịch sử
      if (booking.status !== "CheckedIn") {
        const oldStatus = booking.status;
        await bookingRepository.updateStatus(booking.id, "CheckedIn");

        // Ghi lịch sử tự động
        // createBookingHistoryUseCase cũng sẽ tự động tham gia transaction này
        await createBookingHistoryUseCase.execute({
          bookingId: booking.id,
          oldStatus: oldStatus as any,
          newStatus: "CheckedIn",
          userId: input.checkInStaffUserId, // ID Tài khoản thực hiện Check-in
        });
      }

      // 5. Trả về slip đã được populate để khớp với kết quả dự án cũ
      const populatedSlip = await rentalReceiptRepository.findById(slip.id, {
        booking: true,
        room: true,
        checkInStaff: true,
      });

      return populatedSlip!;
    });
  },
};

