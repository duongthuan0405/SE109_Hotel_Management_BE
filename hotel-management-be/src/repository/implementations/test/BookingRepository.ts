import { type Booking } from "../../../models/Booking.js";
import { type IBookingRepository, type BookingInclude, type CreateBookingData } from "../../types/IBookingRepository.js";
import customerRepository from "./CustomerRepository.js";
import roomRepository from "./RoomRepository.js";
import crypto from "crypto";

const mockBookings: Booking[] = [
  {
    id: "booking-1",
    code: "DP001",
    customerId: "cust-1",
    roomClass: "STD",
    startDate: new Date("2026-05-01"),
    endDate: new Date("2026-05-03"),
    guestCount: 2,
    deposit: 500000,
    totalAmount: 1000000,
    details: [
      { code: "CTDP1", roomId: "room-1" }
    ],
    status: "Confirmed",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const applyInclude = async (booking: Booking, include?: BookingInclude): Promise<Booking> => {
  if (!include) return { ...booking };

  const result = { ...booking };

  if (include.customer && booking.customerId) {
    result.customer = (await customerRepository.findById(booking.customerId)) || undefined;
  }

  if (include.rooms && booking.details) {
    result.details = await Promise.all(
      booking.details.map(async (d) => {
        const room = await roomRepository.findById(d.roomId);
        return { ...d, room: room || undefined };
      })
    );
  }

  return result;
};

const bookingRepositoryImpl: IBookingRepository = {
  findAll: async (include): Promise<Booking[]> => {
    return Promise.all(mockBookings.map((b) => applyInclude(b, include)));
  },
  findById: async (id, include): Promise<Booking | null> => {
    const booking = mockBookings.find((b) => b.id === id);
    if (!booking) return null;
    return applyInclude(booking, include);
  },
  findByCode: async (code, include): Promise<Booking | null> => {
    const booking = mockBookings.find((b) => b.code === code);
    if (!booking) return null;
    return applyInclude(booking, include);
  },
  findByCustomerId: async (customerId, include): Promise<Booking[]> => {
    const filtered = mockBookings.filter((b) => b.customerId === customerId);
    return Promise.all(filtered.map((b) => applyInclude(b, include)));
  },
  create: async (bookingData: CreateBookingData): Promise<Booking> => {
    const code = bookingData.code || (await bookingRepositoryImpl.generateNextCode());
    const newBooking: Booking = {
      ...bookingData,
      id: crypto.randomUUID(),
      code,
      details: bookingData.details.map((d: any, index: number) => ({
        ...d,
        code: d.code || bookingRepositoryImpl.generateNextDetailCode(index)
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockBookings.push(newBooking);
    return newBooking;
  },
  save: async (booking, include): Promise<Booking> => {
    const index = mockBookings.findIndex((b) => b.id === booking.id);
    if (index !== -1) {
      const updatedBooking = {
        ...booking,
        details: booking.details.map((d: any, idx: number) => ({
          ...d,
          code: d.code || bookingRepositoryImpl.generateNextDetailCode(idx),
        })),
        updatedAt: new Date(),
      };
      mockBookings[index] = updatedBooking;
      return applyInclude(mockBookings[index]!, include);
    }
    return applyInclude(booking, include);
  },
  deleteById: async (id: string): Promise<void> => {
    const index = mockBookings.findIndex((b) => b.id === id);
    if (index !== -1) {
      mockBookings.splice(index, 1);
    }
  },
  countAll: async (): Promise<number> => {
    return mockBookings.length;
  },
  generateNextCode: async (): Promise<string> => {
    const nextId = mockBookings.length + 1;
    return `DP${String(nextId).padStart(3, "0")}`;
  },
  generateNextDetailCode: (index: number): string => {
    return `CTDP-${Date.now()}-${index}`;
  },
  findOverlappingByRoom: async (roomId: string, startDate: Date, endDate: Date, excludeBookingId?: string): Promise<Booking | null> => {
    const overlap = mockBookings.find((b) => {
      if (excludeBookingId && b.id === excludeBookingId) return false;
      if (["Cancelled", "CheckedOut", "NoShow"].includes(b.status)) return false;
      
      const hasRoom = b.details.some(d => d.roomId === roomId);
      if (!hasRoom) return false;

      // Logic kiểm tra chồng chéo: (StartA < EndB) AND (EndA > StartB)
      return startDate < b.endDate && endDate > b.startDate;
    });
    return overlap || null;
  },
  updateStatus: async (id: string, status: any): Promise<void> => {
    const booking = mockBookings.find(b => b.id === id);
    if (booking) {
      booking.status = status;
      booking.updatedAt = new Date();
    }
  },
};

export default bookingRepositoryImpl;
