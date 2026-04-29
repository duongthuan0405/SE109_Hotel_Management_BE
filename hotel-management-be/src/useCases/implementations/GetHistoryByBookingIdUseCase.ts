import { type IGetHistoryByBookingIdUseCase, type GetHistoryByBookingIdUCInput } from "../types/IBookingHistoryUseCases.js";
import { type BookingHistory } from "../../models/BookingHistory.js";
import { bookingHistoryRepository } from "../../repository/index.js";

export const getHistoryByBookingId: IGetHistoryByBookingIdUseCase = {
  execute: async (input: GetHistoryByBookingIdUCInput): Promise<BookingHistory[]> => {
    return await bookingHistoryRepository.findByBookingId(input.bookingId);
  },
};

export default getHistoryByBookingId;
