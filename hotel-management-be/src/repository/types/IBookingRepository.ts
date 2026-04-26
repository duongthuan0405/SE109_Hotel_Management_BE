import { type Booking } from "../../models/Booking.js";

export type IBookingRepository = {
  findAll: () => Promise<Booking[]>;
  findById: (id: string) => Promise<Booking | null>;
  findByCustomerId: (customerId: string) => Promise<Booking[]>;
  create: (booking: Omit<Booking, "id" | "code" | "createdAt" | "updatedAt">) => Promise<Booking>;
  save: (booking: Booking) => Promise<Booking>;
  deleteById: (id: string) => Promise<void>;
  count: () => Promise<number>;
  
  // Các phương thức bổ trợ logic nghiệp vụ
  generateNextCode: () => Promise<string>;
  findOverlappingByRoom: (roomId: string, startDate: Date, endDate: Date, excludeBookingId?: string) => Promise<Booking | null>;
};
