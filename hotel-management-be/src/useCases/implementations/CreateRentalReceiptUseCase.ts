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
      // 1. Tìm Staff từ UserID (Mapping ở UseCase)
      const staff = await staffRepository.findByUserId(input.checkInStaffUserId);
      if (!staff) {
        throw { status: 403, message: "Nhân viên thực hiện không tồn tại" };
      }

      // 2. Tìm Booking để lấy thông tin phòng & ngày kết thúc
      const booking = await bookingRepository.findById(input.bookingId, { rooms: true });
      if (!booking) {
        throw { status: 404, message: "Đơn đặt phòng không tồn tại" };
      }

      if (booking.status === "CheckedIn") {
        throw { status: 400, message: "Đơn đặt phòng đã được Check-in rồi" };
      }
      if (booking.status === "CheckedOut") {
        throw { status: 400, message: "Đơn đặt phòng đã được Check-out, không thể Check-in" };
      }
      if (booking.status === "Cancelled") {
        throw { status: 400, message: "Đơn đặt phòng đã bị hủy, không thể Check-in" };
      }

      // Lấy Ngày trả dự kiến chung cho toàn bộ phòng
      let finalExpectedCheckOutDate = input.expectedCheckOutDate;
      if (!finalExpectedCheckOutDate || isNaN(finalExpectedCheckOutDate.getTime())) {
        finalExpectedCheckOutDate = booking.endDate;
      }

      // Tìm toàn bộ danh sách Room ID cần Check-in (Từ chi tiết đặt phòng)
      const roomIds: string[] = [];
      if (booking.details && booking.details.length > 0) {
        booking.details.forEach(detail => {
          if (detail.roomId) roomIds.push(detail.roomId);
        });
      } else if (input.roomId) {
        roomIds.push(input.roomId);
      }

      if (roomIds.length === 0) {
        throw { status: 400, message: "Đơn đặt phòng chưa được gán phòng nào để Check-in" };
      }

      const createdSlips: RentalSlip[] = [];

      // 3. Duyệt qua toàn bộ các phòng để tạo Phiếu thuê phòng (Rental Slip)
      for (const rid of roomIds) {
        // Xác định đơn giá cho từng phòng cụ thể
        let finalAdjustedPrice = input.adjustedPrice;
        if (finalAdjustedPrice === undefined || finalAdjustedPrice === null) {
          const matchingDetail = booking.details.find(d => d.roomId === rid);
          finalAdjustedPrice = matchingDetail?.room?.price || 0;
        }

        // Tạo phiếu mới (Mã PTP được Repo tự sinh)
        const slip = await rentalReceiptRepository.create({
          bookingId: input.bookingId,
          roomId: rid,
          checkInDate: new Date(),
          expectedCheckOutDate: finalExpectedCheckOutDate,
          adjustedPrice: finalAdjustedPrice,
          checkInStaffId: staff.id,
          status: "CheckedIn",
        });

        // Cập nhật trạng thái phòng sang Occupied
        await roomRepository.updateStatus(rid, "Occupied");

        // Lấy bản ghi đã populate
        const populatedSlip = await rentalReceiptRepository.findById(slip.id, {
          booking: true,
          room: true,
          checkInStaff: true,
        });
        if (populatedSlip) {
          createdSlips.push(populatedSlip);
        }
      }

      // 4. TỰ ĐỘNG HÓA: Cập nhật trạng thái Booking và ghi lịch sử
     
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

