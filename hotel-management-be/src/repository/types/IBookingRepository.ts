import { type Booking } from "../../models/Booking.js";

export type BookingInclude = {
  customer?: boolean;
  rooms?: boolean; // Populate rooms in details
};

export type IBookingRepository = {
  findAll: (include?: BookingInclude) => Promise<Booking[]>;
  findById: (id: string, include?: BookingInclude) => Promise<Booking | null>;
  findByCustomerId: (customerId: string, include?: BookingInclude) => Promise<Booking[]>;
  create: (booking: Omit<Booking, "id" | "code" | "createdAt" | "updatedAt" | "customer">) => Promise<Booking>;
  save: (booking: Booking, include?: BookingInclude) => Promise<Booking>;
  deleteById: (id: string) => Promise<void>;
  count: () => Promise<number>;
  
  // Các phương thức bổ trợ logic nghiệp vụ
  generateNextCode: () => Promise<string>;
  findOverlappingByRoom: (roomId: string, startDate: Date, endDate: Date, excludeBookingId?: string) => Promise<Booking | null>;
};
