import { bookingRepository, customerRepository } from "../../repository/index.js";
import type { ICustomerGetBookingByIdUseCase, BookingUCOutput } from "../types/IBookingUseCases.js";

const customerGetBookingByIdUseCase: ICustomerGetBookingByIdUseCase = {
  execute: async (input: { id: string, userId: string }): Promise<BookingUCOutput> => {
    const customer = await customerRepository.findByUserId(input.userId);
    if (!customer) throw { status: 404, message: "Không tìm thấy thông tin khách hàng" };

    const booking = await bookingRepository.findById(input.id, {
      customer: true,
      rooms: true,
    });
    if (!booking) {
      throw { status: 404, message: "Đặt phòng không tồn tại" };
    }
    
    // Ownership check
    if (booking.customerId !== customer.id) {
      throw { status: 403, message: "Bạn không có quyền xem thông tin đặt phòng này" };
    }
    
    return booking;
  },
};

export default customerGetBookingByIdUseCase;
