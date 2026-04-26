import { bookingRepository, roomRepository } from "../../repository/index.js";
import type { ICustomerCancelBookingUseCase, CancelBookingUCInput, BookingUCOutput } from "../types/IBookingUseCases.js";

const customerCancelBookingUseCase: ICustomerCancelBookingUseCase = {
  execute: async (input: CancelBookingUCInput & { customerId: string }): Promise<BookingUCOutput> => {
    const { id, customerId } = input;

    const booking = await bookingRepository.findById(id);
    if (!booking) {
      throw { status: 404, message: "Đơn đặt phòng không tồn tại" };
    }

    // Kiểm tra quyền sở hữu
    if (booking.customerId !== customerId) {
      throw { status: 403, message: "Bạn không có quyền hủy đơn đặt phòng này" };
    }

    // 1. Cập nhật trạng thái đơn đặt phòng
    booking.status = "Cancelled";
    const updatedBooking = await bookingRepository.save(booking);

    // 2. Giải phóng các phòng liên quan
    if (updatedBooking.details && updatedBooking.details.length > 0) {
      for (const detail of updatedBooking.details) {
        await roomRepository.updateStatus(detail.roomId, "Available");
      }
    }

    return updatedBooking;
  },
};

export default customerCancelBookingUseCase;
