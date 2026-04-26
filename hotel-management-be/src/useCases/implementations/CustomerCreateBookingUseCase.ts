import { bookingRepository } from "../../repository/index.js";
import type { ICustomerCreateBookingUseCase, CreateBookingUCInput, BookingUCOutput } from "../types/IBookingUseCases.js";

const customerCreateBookingUseCase: ICustomerCreateBookingUseCase = {
  execute: async (input: CreateBookingUCInput): Promise<BookingUCOutput> => {
    if (!input.customerId || !input.roomClass || !input.startDate || !input.endDate || !input.guestCount) {
      throw { status: 400, message: "Vui lòng cung cấp đủ thông tin đặt phòng" };
    }

    let finalDetails = input.details || [];
    if (finalDetails.length === 0) {
      finalDetails = [{
        code: `CTDP-CUST-${Date.now()}`,
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

export default customerCreateBookingUseCase;
