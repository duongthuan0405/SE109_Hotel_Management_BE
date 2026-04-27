import { type Booking, type BookingDetail } from "../../models/Booking.js";

export type BookingInclude = {
  customer?: boolean;
  rooms?: boolean; // Populate rooms in details
};

export type CreateBookingData = Omit<Booking, "id" | "code" | "createdAt" | "updatedAt" | "customer" | "details"> & {
  details: (Omit<BookingDetail, "code" | "room"> & { code?: string })[];
};

export type IBookingRepository = {
  findAll: (include?: BookingInclude) => Promise<Booking[]>;
  findById: (id: string, include?: BookingInclude) => Promise<Booking | null>;
  findByCode: (code: string, include?: BookingInclude) => Promise<Booking | null>;
  findByCustomerId: (customerId: string, include?: BookingInclude) => Promise<Booking[]>;
  create: (booking: CreateBookingData) => Promise<Booking>;
  save: (booking: Booking, include?: BookingInclude) => Promise<Booking>;
  deleteById: (id: string) => Promise<void>;
  count: () => Promise<number>;
  
  // Các phương thức bổ trợ logic nghiệp vụ
  generateNextCode: () => Promise<string>;
  findOverlappingByRoom: (roomId: string, startDate: Date, endDate: Date, excludeBookingId?: string) => Promise<Booking | null>;
};
