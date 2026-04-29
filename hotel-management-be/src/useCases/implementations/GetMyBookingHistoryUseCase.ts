import { type IGetMyBookingHistoryUseCase, type GetMyBookingHistoryUCInput } from "../types/IBookingHistoryUseCases.js";
import { type BookingHistory } from "../../models/BookingHistory.js";
import { bookingHistoryRepository, bookingRepository, customerRepository } from "../../repository/index.js";

export const getMyBookingHistory: IGetMyBookingHistoryUseCase = {
  execute: async (input: GetMyBookingHistoryUCInput): Promise<BookingHistory[]> => {
    // 1. Tìm thông tin khách hàng dựa trên userId
    const customer = await customerRepository.findByUserId(input.userId);
    if (!customer) {
      return [];
    }

    // 2. Tìm tất cả đơn đặt phòng của khách hàng này
    const bookings = await bookingRepository.findByCustomerId(customer.id);
    if (bookings.length === 0) {
      return [];
    }

    const bookingIds = bookings.map((b) => b.id);

    // 3. Lấy lịch sử của tất cả các đơn đặt phòng đó
    return await bookingHistoryRepository.findByBookingIds(bookingIds);
  },
};

export default getMyBookingHistory;
