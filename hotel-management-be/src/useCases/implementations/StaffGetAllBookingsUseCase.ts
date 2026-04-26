import { bookingRepository } from "../../repository/index.js";
import type { IStaffGetAllBookingsUseCase, BookingUCOutput } from "../types/IBookingUseCases.js";

const staffGetAllBookingsUseCase: IStaffGetAllBookingsUseCase = {
  execute: async (): Promise<BookingUCOutput[]> => {
    return await bookingRepository.findAll();
  },
};

export default staffGetAllBookingsUseCase;
