import { type BookingHistory } from "../../../models/BookingHistory.js";
import { type IBookingHistoryRepository } from "../../types/IBookingHistoryRepository.js";
import prisma from "../../../config/prisma.js";

const mapToEntity = (history: any): BookingHistory => ({
  id: history.id,
  code: history.code,
  bookingId: history.bookingId,
  oldStatus: (history.oldStatus as any) || undefined,
  newStatus: history.newStatus as any,
  changedAt: history.changedAt,
  userId: history.userId || undefined,
  createdAt: history.createdAt,
  updatedAt: history.updatedAt,
  user: history.user ? {
    id: history.user.id,
    username: history.user.username,
    passwordHash: history.user.passwordHash,
    role: history.user.role,
  } : undefined,
});

const bookingHistoryPrismaRepository: IBookingHistoryRepository = {
  findAll: async (): Promise<BookingHistory[]> => {
    const histories = await prisma.bookingHistory.findMany({
      include: { user: true },
    });
    return histories.map(mapToEntity);
  },

  findById: async (id: string): Promise<BookingHistory | null> => {
    const history = await prisma.bookingHistory.findUnique({
      where: { id },
      include: { user: true },
    });
    return history ? mapToEntity(history) : null;
  },

  findByBookingId: async (bookingId: string): Promise<BookingHistory[]> => {
    const histories = await prisma.bookingHistory.findMany({
      where: { bookingId },
      include: { user: true },
    });
    return histories.map(mapToEntity);
  },

  findByBookingIds: async (bookingIds: string[]): Promise<BookingHistory[]> => {
    const histories = await prisma.bookingHistory.findMany({
      where: { bookingId: { in: bookingIds } },
      include: { user: true },
    });
    return histories.map(mapToEntity);
  },

  findByUserId: async (userId: string): Promise<BookingHistory[]> => {
    const histories = await prisma.bookingHistory.findMany({
      where: { userId },
      include: { user: true },
    });
    return histories.map(mapToEntity);
  },

  findByCode: async (code: string): Promise<BookingHistory | null> => {
    const history = await prisma.bookingHistory.findUnique({
      where: { code },
      include: { user: true },
    });
    return history ? mapToEntity(history) : null;
  },

  create: async (data: Omit<BookingHistory, "id" | "changedAt" | "code"> & { code?: string | undefined }): Promise<BookingHistory> => {
    const code = data.code || (await bookingHistoryPrismaRepository.generateNextCode());
    const history = await prisma.bookingHistory.create({
      data: {
        code,
        bookingId: data.bookingId,
        oldStatus: data.oldStatus ?? null,
        newStatus: data.newStatus,
        userId: data.userId || null,
        changedAt: new Date(),
      },
      include: { user: true },
    });
    return mapToEntity(history);
  },

  delete: async (id: string): Promise<void> => {
    await prisma.bookingHistory.delete({ where: { id } });
  },

  generateNextCode: async (): Promise<string> => {
    const count = await prisma.bookingHistory.count();
    return `LSDP${(count + 1).toString().padStart(4, "0")}`;
  },
};

export default bookingHistoryPrismaRepository;
