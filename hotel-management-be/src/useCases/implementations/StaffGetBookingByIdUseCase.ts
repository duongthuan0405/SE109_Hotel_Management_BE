import { bookingRepository } from "../../repository/index.js";
import type { IStaffGetBookingByIdUseCase, BookingUCOutput } from "../types/IBookingUseCases.js";

const staffGetBookingByIdUseCase: IStaffGetBookingByIdUseCase = {
  execute: async (input: { id: string }): Promise<BookingUCOutput> => {
    const booking = await bookingRepository.findById(input.id);
    if (!booking) {
      throw { status: 404, message: "Đặt phòng không tồn tại" };
    }
    return booking;
  },
};

export default staffGetBookingByIdUseCase;
