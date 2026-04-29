import { type IDeleteBookingHistoryUseCase, type DeleteBookingHistoryUCInput } from "../types/IBookingHistoryUseCases.js";
import { type BookingHistory } from "../../models/BookingHistory.js";
import { bookingHistoryRepository } from "../../repository/index.js";

export const deleteBookingHistory: IDeleteBookingHistoryUseCase = {
  execute: async (input: DeleteBookingHistoryUCInput): Promise<BookingHistory> => {
    const history = await bookingHistoryRepository.findById(input.id);
    if (!history) {
      throw { status: 404, message: "Lịch sử đặt phòng không tồn tại" };
    }
    await bookingHistoryRepository.delete(input.id);
    return history;
  },
};

export default deleteBookingHistory;
