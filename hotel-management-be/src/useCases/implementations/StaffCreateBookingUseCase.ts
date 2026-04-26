import { bookingRepository } from "../../repository/index.js";
import type { IStaffCreateBookingUseCase, CreateBookingUCInput, BookingUCOutput } from "../types/IBookingUseCases.js";

const staffCreateBookingUseCase: IStaffCreateBookingUseCase = {
  execute: async (input: CreateBookingUCInput): Promise<BookingUCOutput> => {
    if (!input.roomClass || !input.startDate || !input.endDate || !input.guestCount) {
      throw { status: 400, message: "Vui lòng cung cấp đủ thông tin đặt phòng" };
    }

    let finalDetails = input.details || [];
    if (finalDetails.length === 0) {
      finalDetails = [{
        code: `CTDP${Date.now()}`,
        roomId: `room-auto-${Math.floor(Math.random() * 1000)}`
      }];
    }

    const booking = await bookingRepository.create({
      customerId: input.customerId,
      roomClass: input.roomClass,
      startDate: input.startDate,
      endDate: input.endDate,
      guestCount: input.guestCount,
      deposit: input.deposit || 0,
      details: finalDetails,
      status: "Pending",
    });

    return booking;
  },
};

export default staffCreateBookingUseCase;
