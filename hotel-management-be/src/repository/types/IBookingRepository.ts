import { type Booking, type BookingDetail } from "../../models/Booking.js";

export type IBookingRepository = {
  findAll: () => Promise<Booking[]>;
  findById: (id: string) => Promise<Booking | null>;
  findByCustomerId: (customerId: string) => Promise<Booking[]>;
  create: (booking: Omit<Booking, "id" | "code" | "createdAt" | "updatedAt">) => Promise<Booking>;
  save: (booking: Booking) => Promise<Booking>;
  deleteById: (id: string) => Promise<void>;
  count: () => Promise<number>;
};
