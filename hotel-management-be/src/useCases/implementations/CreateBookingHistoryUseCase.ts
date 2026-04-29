import { type ICreateBookingHistoryUseCase, type CreateBookingHistoryUCInput } from "../types/IBookingHistoryUseCases.js";
import { type BookingHistory } from "../../models/BookingHistory.js";
import { bookingHistoryRepository } from "../../repository/index.js";

export const createBookingHistory: ICreateBookingHistoryUseCase = {
  execute: async (input: CreateBookingHistoryUCInput): Promise<BookingHistory> => {
    const history = await bookingHistoryRepository.create({
      bookingId: input.bookingId,
      oldStatus: input.oldStatus,
      newStatus: input.newStatus,
      userId: input.userId,
    });

    return history;
  },
};

export default createBookingHistory;
