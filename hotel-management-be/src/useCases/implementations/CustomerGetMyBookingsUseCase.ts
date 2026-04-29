import { bookingRepository, customerRepository } from "../../repository/index.js";
import type { ICustomerGetMyBookingsUseCase, BookingUCOutput } from "../types/IBookingUseCases.js";

const customerGetMyBookingsUseCase: ICustomerGetMyBookingsUseCase = {
  execute: async (input: { userId: string }): Promise<BookingUCOutput[]> => {
    const customer = await customerRepository.findByUserId(input.userId);
    if (!customer) throw { status: 404, message: "Không tìm thấy thông tin khách hàng" };

    return await bookingRepository.findByCustomerId(customer.id, {
      customer: true,
      rooms: true,
    });
  },
};

export default customerGetMyBookingsUseCase;
