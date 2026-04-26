import { bookingRepository } from "../../repository/index.js";
import type { ICustomerCancelBookingUseCase, BookingUCOutput } from "../types/IBookingUseCases.js";

const customerCancelBookingUseCase: ICustomerCancelBookingUseCase = {
  execute: async (input: { id: string, customerId: string }): Promise<BookingUCOutput> => {
    const booking = await bookingRepository.findById(input.id);
    if (!booking) {
      throw { status: 404, message: "Đặt phòng không tồn tại" };
    }

    // Ownership check
    if (booking.customerId !== input.customerId) {
      throw { status: 403, message: "Bạn không có quyền hủy đặt phòng này" };
    }

    booking.status = "Cancelled";
    return await bookingRepository.save(booking);
  },
};

export default customerCancelBookingUseCase;
