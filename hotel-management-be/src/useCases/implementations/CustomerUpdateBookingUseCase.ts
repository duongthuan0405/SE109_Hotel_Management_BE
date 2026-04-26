import { bookingRepository } from "../../repository/index.js";
import type { ICustomerUpdateBookingUseCase, UpdateBookingUCInput, BookingUCOutput } from "../types/IBookingUseCases.js";

const customerUpdateBookingUseCase: ICustomerUpdateBookingUseCase = {
  execute: async (input: UpdateBookingUCInput & { customerId: string }): Promise<BookingUCOutput> => {
    const { id, customerId, status, details, startDate, endDate } = input;

    const existingBooking = await bookingRepository.findById(id);
    if (!existingBooking) {
      throw { status: 404, message: "Đơn đặt phòng không tồn tại" };
    }

    // Kiểm tra quyền sở hữu
    if (existingBooking.customerId !== customerId) {
      throw { status: 403, message: "Bạn không có quyền chỉnh sửa đơn đặt phòng này" };
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

    return updatedBooking;
  },
};

export default customerUpdateBookingUseCase;
