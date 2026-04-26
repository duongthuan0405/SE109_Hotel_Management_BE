import { bookingRepository } from "../../repository/index.js";
import type { ICustomerDeleteBookingUseCase, BookingUCOutput } from "../types/IBookingUseCases.js";

const customerDeleteBookingUseCase: ICustomerDeleteBookingUseCase = {
  execute: async (input: { id: string, customerId: string }): Promise<BookingUCOutput> => {
    const booking = await bookingRepository.findById(input.id);
    if (!booking) {
      throw { status: 404, message: "Đặt phòng không tồn tại" };
    }

    // Ownership check
    if (booking.customerId !== input.customerId) {
      throw { status: 403, message: "Bạn không có quyền xóa đặt phòng này" };
    }

    await bookingRepository.deleteById(input.id);
    return booking;
  },
};

export default customerDeleteBookingUseCase;
