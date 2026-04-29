import { bookingRepository, roomRepository, customerRepository } from "../../repository/index.js";
import { createBookingHistory as createBookingHistoryUseCase } from "./CreateBookingHistoryUseCase.js";
import type { ICustomerCancelBookingUseCase, CancelBookingUCInput, BookingUCOutput } from "../types/IBookingUseCases.js";

const customerCancelBookingUseCase: ICustomerCancelBookingUseCase = {
  execute: async (input: CancelBookingUCInput & { userId: string }): Promise<BookingUCOutput> => {
    const { id, userId } = input;

    const customer = await customerRepository.findByUserId(userId);
    if (!customer) throw { status: 404, message: "Không tìm thấy thông tin khách hàng" };

    const booking = await bookingRepository.findById(id);
    if (!booking) {
      throw { status: 404, message: "Đơn đặt phòng không tồn tại" };
    }

    // Kiểm tra quyền sở hữu
    if (booking.customerId !== customer.id) {
      throw { status: 403, message: "Bạn không có quyền hủy đơn đặt phòng này" };
    }

    // 1. Cập nhật trạng thái đơn đặt phòng
    const oldStatus = booking.status;
    booking.status = "Cancelled";
    const updatedBooking = await bookingRepository.save(booking);

    // 2. Ghi lịch sử tự động
    await createBookingHistoryUseCase.execute({
      code: `LSDP-CAN-CUST-${Date.now()}`,
      bookingId: updatedBooking.id,
      oldStatus: oldStatus as any,
      newStatus: "Cancelled",
      userId: userId, // Ghi nhận ID của User khách hàng
    });

    // 3. Giải phóng các phòng liên quan
    if (updatedBooking.details && updatedBooking.details.length > 0) {
      for (const detail of updatedBooking.details) {
        await roomRepository.updateStatus(detail.roomId, "Available");
      }
    }

    return (await bookingRepository.findById(updatedBooking.id, { customer: true, rooms: true }))!;
  },
};

export default customerCancelBookingUseCase;
