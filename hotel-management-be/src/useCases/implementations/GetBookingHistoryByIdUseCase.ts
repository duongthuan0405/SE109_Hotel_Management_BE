import { type IGetBookingHistoryByIdUseCase, type GetBookingHistoryByIdUCInput } from "../types/IBookingHistoryUseCases.js";
import { type BookingHistory } from "../../models/BookingHistory.js";
import { bookingHistoryRepository } from "../../repository/index.js";

export const getBookingHistoryById: IGetBookingHistoryByIdUseCase = {
  execute: async (input: GetBookingHistoryByIdUCInput): Promise<BookingHistory> => {
    const history = await bookingHistoryRepository.findById(input.id);
    if (!history) {
      throw { status: 404, message: "Lịch sử đặt phòng không tồn tại" };
    }
    return history;
  },
};

export default getBookingHistoryById;
