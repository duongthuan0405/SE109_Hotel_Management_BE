import { bookingRepository } from "../../repository/index.js";
import type { IStaffUpdateBookingUseCase, UpdateBookingUCInput, BookingUCOutput } from "../types/IBookingUseCases.js";

const staffUpdateBookingUseCase: IStaffUpdateBookingUseCase = {
  execute: async (input: UpdateBookingUCInput): Promise<BookingUCOutput> => {
    const booking = await bookingRepository.findById(input.id);
    if (!booking) {
      throw { status: 404, message: "Đặt phòng không tồn tại" };
    }

    if (input.roomClass !== undefined) booking.roomClass = input.roomClass;
    if (input.startDate !== undefined) booking.startDate = input.startDate;
    if (input.endDate !== undefined) booking.endDate = input.endDate;
    if (input.guestCount !== undefined) booking.guestCount = input.guestCount;
    if (input.deposit !== undefined) booking.deposit = input.deposit;
    if (input.status !== undefined) booking.status = input.status as any;
    if (input.details !== undefined) {
      booking.details = input.details.map(d => ({ code: d.code, roomId: d.roomId }));
    }

    return await bookingRepository.save(booking);
  },
};

export default staffUpdateBookingUseCase;
