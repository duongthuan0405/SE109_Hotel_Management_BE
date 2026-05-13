import {
  type ICreateRentalReceiptUseCase,
  type CreateRentalReceiptUCInput,
} from "../types/IRentalReceiptUseCases.js";
import { type RentalSlip } from "../../models/RentalSlip.js";
import { rentalReceiptRepository, roomRepository, bookingRepository, staffRepository, unitOfWork } from "../../repository/index.js";
import { createBookingHistory as createBookingHistoryUseCase } from "./CreateBookingHistoryUseCase.js";

export const createRentalReceipt: ICreateRentalReceiptUseCase = {
  execute: async (input: CreateRentalReceiptUCInput): Promise<RentalSlip[]> => {
    return await unitOfWork.runInTransaction(async () => {
      // 1. Tìm Staff từ UserID
      const staff = await staffRepository.findByUserId(input.checkInStaffUserId);
      if (!staff) {
        throw { status: 403, message: "Nhân viên thực hiện không tồn tại" };
      }

      // 2. Tìm Booking và lấy kèm chi tiết phòng
      const booking = await bookingRepository.findById(input.bookingId, { rooms: true });
      if (!booking) {
        throw { status: 404, message: "Đơn đặt phòng không tồn tại" };
      }

      // Xác thực trạng thái booking trước khi check-in
      if (booking.status === "CheckedIn") {
        throw { status: 400, message: "Đơn đặt phòng đã được Check-in rồi" };
      }
      if (booking.status === "CheckedOut") {
        throw { status: 400, message: "Đơn đặt phòng đã được Check-out, không thể Check-in" };
      }
      if (booking.status === "Cancelled") {
        throw { status: 400, message: "Đơn đặt phòng đã bị hủy, không thể Check-in" };
      }

      console.log(`[CheckIn] Tìm thấy ${booking.details?.length || 0} chi tiết phòng cho Booking ${booking.code}`);

      const createdSlips: RentalSlip[] = [];

      // 3. Chuẩn bị mã số hàng loạt từ Repository
      const detailCount = booking.details?.length || 0;
      const nextCodes = await rentalReceiptRepository.generateNextCodes(detailCount);
      let codeIndex = 0;

      // 4. Check-in TOÀN BỘ các phòng đã đặt trong Booking
      for (const detail of booking.details || []) {
        const roomId = detail.roomId;
        if (!roomId) continue;

        // Kiểm tra xem Client có gửi thông tin điều chỉnh cho phòng này không
        const override = input.rooms?.find((r) => r.roomId === roomId);

        const finalPrice = override?.adjustedPrice ?? detail.room?.price ?? 0;
        const finalCheckOutDate = override?.expectedCheckOutDate ?? booking.endDate;

        // Kiểm tra tính hợp lệ của ngày trả
        if (finalCheckOutDate && isNaN(new Date(finalCheckOutDate).getTime())) {
          console.error(`[CheckIn] Ngày trả phòng không hợp lệ cho phòng ${roomId}`);
          codeIndex++;
          continue; 
        }

        const generatedCode = nextCodes[codeIndex++];

        console.log(`[CheckIn] Đang tạo phiếu ${generatedCode} cho phòng ${roomId}`);

        const slip = await rentalReceiptRepository.create({
          code: generatedCode,
          bookingId: input.bookingId,
          roomId: roomId,
          checkInDate: new Date(),
          expectedCheckOutDate: finalCheckOutDate,
          adjustedPrice: finalPrice,
          checkInStaffId: staff.id,
          status: "CheckedIn",
        });

        // 5. Cập nhật trạng thái phòng sang Occupied
        await roomRepository.updateStatus(roomId, "Occupied");

        const populatedSlip = await rentalReceiptRepository.findById(slip.id, {
          booking: true,
          room: true,
          checkInStaff: true,
        });
        if (populatedSlip) createdSlips.push(populatedSlip);
      }

      console.log(`[CheckIn] Đã tạo thành công ${createdSlips.length} phiếu thuê`);

      // 5. Cập nhật trạng thái Booking sang CheckedIn nếu chưa
      const oldStatus = booking.status;
        await bookingRepository.updateStatus(booking.id, "CheckedIn");

        // Ghi lịch sử tự động
        await createBookingHistoryUseCase.execute({
          bookingId: booking.id,
          oldStatus: oldStatus as any,
          newStatus: "CheckedIn",
          userId: input.checkInStaffUserId,
        });

      return createdSlips;
    });
  },
};
