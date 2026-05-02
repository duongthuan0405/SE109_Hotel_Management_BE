import { type IBookingHistoryRepository } from "../../types/IBookingHistoryRepository.js";
import { type BookingHistory } from "../../../models/BookingHistory.js";
import { randomUUID } from "crypto";

const mockBookingHistory: BookingHistory[] = [];

export const bookingHistoryRepository: IBookingHistoryRepository = {
  findAll: async (): Promise<BookingHistory[]> => {
    return mockBookingHistory;
  },
  findById: async (id: string): Promise<BookingHistory | null> => {
    return mockBookingHistory.find((history) => history.id === id) || null;
  },
  findByBookingId: async (bookingId: string): Promise<BookingHistory[]> => {
    return mockBookingHistory.filter((history) => history.bookingId === bookingId).sort((a, b) => b.changedAt.getTime() - a.changedAt.getTime());
  },
  findByBookingIds: async (bookingIds: string[]): Promise<BookingHistory[]> => {
    return mockBookingHistory.filter((history) => bookingIds.includes(history.bookingId)).sort((a, b) => b.changedAt.getTime() - a.changedAt.getTime());
  },
  findByUserId: async (userId: string): Promise<BookingHistory[]> => {
    return mockBookingHistory.filter((history) => history.userId === userId).sort((a, b) => b.changedAt.getTime() - a.changedAt.getTime());
  },
  findByCode: async (code: string): Promise<BookingHistory | null> => {
    return mockBookingHistory.find((history) => history.code === code) || null;
  },
  create: async (data: Omit<BookingHistory, "id" | "changedAt" | "code"> & { code?: string | undefined }): Promise<BookingHistory> => {
    const code = data.code || (await bookingHistoryRepository.generateNextCode());
    const newHistory: BookingHistory = {
      ...data,
      code,
      id: randomUUID(),
      changedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockBookingHistory.push(newHistory);
    return newHistory;
  },
  delete: async (id: string): Promise<void> => {
    const index = mockBookingHistory.findIndex((history) => history.id === id);
    if (index !== -1) {
      mockBookingHistory.splice(index, 1);
    }
  },
  generateNextCode: async (): Promise<string> => {
    return `LSDP-AUTO-${Date.now()}`;
  },
};

export default bookingHistoryRepository;
