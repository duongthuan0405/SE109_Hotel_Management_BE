import { type BookingHistory } from "../../models/BookingHistory.js";

export type IBookingHistoryRepository = {
  findAll(): Promise<BookingHistory[]>;
  findById(id: string): Promise<BookingHistory | null>;
  findByBookingId(bookingId: string): Promise<BookingHistory[]>;
  findByCode(code: string): Promise<BookingHistory | null>;
  create(data: Omit<BookingHistory, "id" | "changedAt">): Promise<BookingHistory>;
  delete(id: string): Promise<void>;
};
