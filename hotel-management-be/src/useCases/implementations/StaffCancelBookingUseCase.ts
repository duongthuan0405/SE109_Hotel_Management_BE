import { bookingRepository, roomRepository } from "../../repository/index.js";
import type { IStaffCancelBookingUseCase, CancelBookingUCInput, BookingUCOutput } from "../types/IBookingUseCases.js";

const staffCancelBookingUseCase: IStaffCancelBookingUseCase = {
  execute: async (input: CancelBookingUCInput): Promise<BookingUCOutput> => {
    const { id } = input;

    const booking = await bookingRepository.findById(id);
    if (!booking) {
      throw { status: 404, message: "Đơn đặt phòng không tồn tại" };
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

    return (await bookingRepository.findById(updatedBooking.id, { customer: true, rooms: true }))!;
  },
};

export default staffCancelBookingUseCase;
