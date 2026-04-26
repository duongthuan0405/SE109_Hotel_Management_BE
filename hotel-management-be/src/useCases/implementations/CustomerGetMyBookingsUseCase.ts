import { bookingRepository } from "../../repository/index.js";
import type { ICustomerGetMyBookingsUseCase, BookingUCOutput } from "../types/IBookingUseCases.js";

const customerGetMyBookingsUseCase: ICustomerGetMyBookingsUseCase = {
  execute: async (input: { customerId: string }): Promise<BookingUCOutput[]> => {
    return await bookingRepository.findByCustomerId(input.customerId);
  },
};

export default customerGetMyBookingsUseCase;
