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
    const nextId = mockBookings.length + 1;
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Math.random().toString(36).substring(7)}`,
      code: `DP${String(nextId).padStart(3, "0")}`,
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
      return mockBookings[index];
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
  }
};

export default bookingRepositoryImpl;
