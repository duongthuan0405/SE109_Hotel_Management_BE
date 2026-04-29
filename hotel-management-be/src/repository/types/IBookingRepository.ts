import { type Booking, type BookingDetail } from "../../models/Booking.js";

export type BookingInclude = {
  customer?: boolean;
  rooms?: boolean; // Populate rooms in details
};

export type CreateBookingData = Omit<Booking, "id" | "createdAt" | "updatedAt" | "customer" | "details" | "code"> & {
  code?: string | undefined;
  details: (Omit<BookingDetail, "code" | "room"> & { code?: string | undefined })[];
};

export type IBookingRepository = {
  findAll: (include?: BookingInclude) => Promise<Booking[]>;
  findById: (id: string, include?: BookingInclude) => Promise<Booking | null>;
  findByCode: (code: string, include?: BookingInclude) => Promise<Booking | null>;
  findByCustomerId: (customerId: string, include?: BookingInclude) => Promise<Booking[]>;
  create: (booking: CreateBookingData) => Promise<Booking>;
  save: (booking: Booking, include?: BookingInclude) => Promise<Booking>;
  deleteById: (id: string) => Promise<void>;
  countAll: () => Promise<number>;
  
  // Các phương thức bổ trợ logic nghiệp vụ
  generateNextCode: () => Promise<string>;
  generateNextDetailCode: (index: number) => string;
  findOverlappingByRoom: (roomId: string, startDate: Date, endDate: Date, excludeBookingId?: string) => Promise<Booking | null>;
  updateStatus: (id: string, status: "Pending" | "Confirmed" | "CheckedIn" | "CheckedOut" | "Cancelled" | "NoShow") => Promise<void>;
};
