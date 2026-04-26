import { type Booking } from "../../models/Booking.js";
import { type IBookingRepository } from "../types/IBookingRepository.js";

const mockBookings: Booking[] = [
  {
    id: "booking-1",
    code: "DP001",
    customerId: "customer-1",
    roomClass: "STD",
    startDate: new Date("2026-05-01"),
    endDate: new Date("2026-05-03"),
    guestCount: 2,
    deposit: 500000,
    details: [
      { code: "CTDP1", roomId: "room-1" }
    ],
    status: "Confirmed",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const bookingRepositoryImpl: IBookingRepository = {
  findAll: async (): Promise<Booking[]> => {
    return [...mockBookings];
  },
  findById: async (id: string): Promise<Booking | null> => {
    const booking = mockBookings.find((b) => b.id === id);
    return booking || null;
  },
  findByCustomerId: async (customerId: string): Promise<Booking[]> => {
    return mockBookings.filter((b) => b.customerId === customerId);
  },
  create: async (bookingData: Omit<Booking, "id" | "code" | "createdAt" | "updatedAt">): Promise<Booking> => {
    const code = await bookingRepositoryImpl.generateNextCode();
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Math.random().toString(36).substring(7)}`,
      code: code,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockBookings.push(newBooking);
    return newBooking;
  },
  save: async (booking: Booking): Promise<Booking> => {
    const index = mockBookings.findIndex((b) => b.id === booking.id);
    if (index !== -1) {
      mockBookings[index] = { ...booking, updatedAt: new Date() };
      return mockBookings[index]!;
    }
    return booking;
  },
  deleteById: async (id: string): Promise<void> => {
    const index = mockBookings.findIndex((b) => b.id === id);
    if (index !== -1) {
      mockBookings.splice(index, 1);
    }
  },
  count: async (): Promise<number> => {
    return mockBookings.length;
  },
  generateNextCode: async (): Promise<string> => {
    const lastBooking = [...mockBookings].sort((a, b) => b.code.localeCompare(a.code))[0];
    let nextId = 1;
    if (lastBooking && lastBooking.code) {
      const match = lastBooking.code.match(/DP(\d+)/);
      if (match) {
        nextId = parseInt(match[1]!, 10) + 1;
      }
    }
    return `DP${String(nextId).padStart(3, "0")}`;
  },
  findOverlappingByRoom: async (roomId: string, startDate: Date, endDate: Date, excludeBookingId?: string): Promise<Booking | null> => {
    const overlap = mockBookings.find((b) => {
      if (excludeBookingId && b.id === excludeBookingId) return false;
      if (["Cancelled", "CheckedOut", "NoShow", "Pending"].includes(b.status)) return false;
      
      const hasRoom = b.details.some(d => d.roomId === roomId);
      if (!hasRoom) return false;

      // Logic kiểm tra chồng chéo: (StartA < EndB) AND (EndA > StartB)
      return startDate < b.endDate && endDate > b.startDate;
    });
    return overlap || null;
  }
};

export default bookingRepositoryImpl;
