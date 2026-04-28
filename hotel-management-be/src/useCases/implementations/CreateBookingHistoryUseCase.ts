import { type ICreateBookingHistoryUseCase, type CreateBookingHistoryUCInput } from "../types/IBookingHistoryUseCases.js";
import { type BookingHistory } from "../../models/BookingHistory.js";
import { bookingHistoryRepository } from "../../repository/index.js";

export const createBookingHistory: ICreateBookingHistoryUseCase = {
  execute: async (input: CreateBookingHistoryUCInput): Promise<BookingHistory> => {
    // Check unique code
    const existingHistory = await bookingHistoryRepository.findByCode(input.code);
    if (existingHistory) {
      throw { status: 409, message: "Mã lịch sử đặt phòng đã tồn tại" };
    }

    const history = await bookingHistoryRepository.create({
      code: input.code,
      bookingId: input.bookingId,
      oldStatus: input.oldStatus,
      newStatus: input.newStatus,
      userId: input.userId,
    });

    return history;
  },
};

export default createBookingHistory;
