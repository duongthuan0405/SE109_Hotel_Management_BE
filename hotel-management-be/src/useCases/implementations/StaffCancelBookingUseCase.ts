import { bookingRepository } from "../../repository/index.js";
import type { IStaffCancelBookingUseCase, BookingUCOutput } from "../types/IBookingUseCases.js";

const staffCancelBookingUseCase: IStaffCancelBookingUseCase = {
  execute: async (input: { id: string }): Promise<BookingUCOutput> => {
    const booking = await bookingRepository.findById(input.id);
    if (!booking) {
      throw { status: 404, message: "Đặt phòng không tồn tại" };
    }

    booking.status = "Cancelled";
    return await bookingRepository.save(booking);
  },
};

export default staffCancelBookingUseCase;
