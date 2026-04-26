import { bookingRepository } from "../../repository/index.js";
import type { IStaffDeleteBookingUseCase, BookingUCOutput } from "../types/IBookingUseCases.js";

const staffDeleteBookingUseCase: IStaffDeleteBookingUseCase = {
  execute: async (input: { id: string }): Promise<BookingUCOutput> => {
    const booking = await bookingRepository.findById(input.id);
    if (!booking) {
      throw { status: 404, message: "Đặt phòng không tồn tại" };
    }

    await bookingRepository.deleteById(input.id);
    return booking;
  },
};

export default staffDeleteBookingUseCase;
