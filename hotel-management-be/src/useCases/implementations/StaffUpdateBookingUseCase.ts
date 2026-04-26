import { bookingRepository, roomRepository } from "../../repository/index.js";
import type { IStaffUpdateBookingUseCase, UpdateBookingUCInput, BookingUCOutput } from "../types/IBookingUseCases.js";

const staffUpdateBookingUseCase: IStaffUpdateBookingUseCase = {
  execute: async (input: UpdateBookingUCInput): Promise<BookingUCOutput> => {
    const { id, status, details, startDate, endDate } = input;

    const existingBooking = await bookingRepository.findById(id);
    if (!existingBooking) {
      throw { status: 404, message: "Đơn đặt phòng không tồn tại" };
    }

    // 1. Nếu có thay đổi ngày tháng hoặc phòng, kiểm tra trùng lịch
    const newStart = startDate ? new Date(startDate) : existingBooking.startDate;
    const newEnd = endDate ? new Date(endDate) : existingBooking.endDate;
    const newDetails = details || existingBooking.details;

    if (startDate || endDate || details) {
      for (const detail of newDetails) {
        const overlap = await bookingRepository.findOverlappingByRoom(detail.roomId, newStart, newEnd, id);
        if (overlap) {
          throw { status: 400, message: `Phòng ${detail.roomId} đã bị trùng lịch trong khoảng thời gian mới` };
        }
      }
    }

    // 2. Cập nhật thông tin đơn đặt phòng
    const updatedBooking = await bookingRepository.save({
      ...existingBooking,
      ...input,
      startDate: newStart,
      endDate: newEnd,
      details: newDetails,
      updatedAt: new Date(),
    } as any);

    // 3. Cập nhật trạng thái phòng dựa trên trạng thái đơn đặt phòng
    if (status === "CheckedIn") {
      for (const detail of updatedBooking.details) {
        const room = await roomRepository.findById(detail.roomId);
        if (room) {
          await roomRepository.updateStatus(room.id, "Occupied");
        }
      }
    } else if (status === "CheckedOut" || status === "Cancelled") {
      for (const detail of updatedBooking.details) {
        const room = await roomRepository.findById(detail.roomId);
        if (room) {
          await roomRepository.updateStatus(room.id, "Available");
        }
      }
    }

    return updatedBooking;
  },
};

export default staffUpdateBookingUseCase;
