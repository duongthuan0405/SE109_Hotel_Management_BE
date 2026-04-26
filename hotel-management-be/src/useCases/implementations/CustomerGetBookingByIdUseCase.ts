import { bookingRepository } from "../../repository/index.js";
import type { ICustomerGetBookingByIdUseCase, BookingUCOutput } from "../types/IBookingUseCases.js";

const customerGetBookingByIdUseCase: ICustomerGetBookingByIdUseCase = {
  execute: async (input: { id: string, customerId: string }): Promise<BookingUCOutput> => {
    const booking = await bookingRepository.findById(input.id);
    if (!booking) {
      throw { status: 404, message: "Đặt phòng không tồn tại" };
    }
    
    // Ownership check
    if (booking.customerId !== input.customerId) {
      throw { status: 403, message: "Bạn không có quyền xem thông tin đặt phòng này" };
    }
    
    return booking;
  },
};

export default customerGetBookingByIdUseCase;
