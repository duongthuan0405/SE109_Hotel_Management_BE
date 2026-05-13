import { bookingRepository, unitOfWork } from "../../repository/index.js";
import { type ICancelPendingBookingUseCase, type CancelPendingBookingUCInput } from "../types/IStripeUseCases.js";
import { createBookingHistory as createBookingHistoryUseCase } from "./CreateBookingHistoryUseCase.js";
import { type Booking } from "../../models/Booking.js";

const cancelPendingBookingUseCase: ICancelPendingBookingUseCase = {
  execute: async (input: CancelPendingBookingUCInput): Promise<Booking> => {
    const { bookingId } = input;

    return await unitOfWork.runInTransaction(async () => {
      const booking = await bookingRepository.findById(bookingId);
      if (!booking) {
        throw { status: 404, message: "Không tìm thấy đơn đặt phòng." };
      }

      // Only allow cancelling if it's still pending
      if (booking.status !== "Pending") {
        return (await bookingRepository.findById(bookingId, { customer: true, rooms: true }))!;
      }

      // A. Update Booking Status to Cancelled
      const oldStatus = booking.status;
      await bookingRepository.updateStatus(bookingId, "Cancelled");

      // B. Log action in history
      await createBookingHistoryUseCase.execute({
        bookingId: booking.id,
        oldStatus: oldStatus,
        newStatus: "Cancelled",
        userId: input.userId
      });

      return (await bookingRepository.findById(bookingId, { customer: true, rooms: true }))!;
    });
  },
};

export default cancelPendingBookingUseCase;
