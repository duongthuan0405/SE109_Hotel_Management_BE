import { type IGetAllBookingHistoryUseCase } from "../types/IBookingHistoryUseCases.js";
import { type BookingHistory } from "../../models/BookingHistory.js";
import { bookingHistoryRepository } from "../../repository/index.js";

export const getAllBookingHistory: IGetAllBookingHistoryUseCase = {
  execute: async (): Promise<BookingHistory[]> => {
    return await bookingHistoryRepository.findAll();
  },
};

export default getAllBookingHistory;
