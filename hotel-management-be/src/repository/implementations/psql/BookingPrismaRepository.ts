import { type Booking, type BookingDetail } from "../../../models/Booking.js";
import { type IBookingRepository, type BookingInclude, type CreateBookingData } from "../../types/IBookingRepository.js";
import prisma from "../../../config/prisma.js";

const mapToEntity = (booking: any): Booking => ({
  id: booking.id,
  code: booking.code,
  customerId: booking.customerId || undefined,
  customer: booking.customer ? {
    id: booking.customer.id,
    code: booking.customer.code,
    fullName: booking.customer.fullName,
    identityCard: booking.customer.identityCard,
    phone: booking.customer.phone,
    email: booking.customer.email || undefined,
    address: booking.customer.address || undefined,
    userId: booking.customer.userId || undefined,
    createdAt: booking.customer.createdAt,
    updatedAt: booking.customer.updatedAt,
  } : undefined,
  roomClass: booking.roomClass,
  startDate: booking.startDate,
  endDate: booking.endDate,
  roomQuantity: booking.roomQuantity,
  deposit: booking.deposit,
  totalAmount: booking.totalAmount,
  status: booking.status as Booking["status"],
  details: (booking.details || []).map((d: any) => ({
    id: d.id,
    code: d.code,
    roomId: d.roomId,
    room: d.room ? {
      id: d.room.id,
      code: d.room.code,
      roomTypeId: d.room.roomTypeId,
      price: d.room.price,
      status: d.room.status,
      createdAt: d.room.createdAt,
      updatedAt: d.room.updatedAt,
    } : undefined,
  })),
  createdAt: booking.createdAt,
  updatedAt: booking.updatedAt,
});

const bookingPrismaRepository: IBookingRepository = {
  findAll: async (include?: BookingInclude): Promise<Booking[]> => {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: include?.customer || false,
        details: include?.rooms ? { include: { room: true } } : true,
      },
    });
    return bookings.map(mapToEntity);
  },

  findById: async (id: string, include?: BookingInclude): Promise<Booking | null> => {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: include?.customer || false,
        details: include?.rooms ? { include: { room: true } } : true,
      },
    });
    return booking ? mapToEntity(booking) : null;
  },

  findByCode: async (code: string, include?: BookingInclude): Promise<Booking | null> => {
    const booking = await prisma.booking.findUnique({
      where: { code },
      include: {
        customer: include?.customer || false,
        details: include?.rooms ? { include: { room: true } } : true,
      },
    });
    return booking ? mapToEntity(booking) : null;
  },

  findByCustomerId: async (customerId: string, include?: BookingInclude): Promise<Booking[]> => {
    const bookings = await prisma.booking.findMany({
      where: { customerId },
      include: {
        customer: include?.customer || false,
        details: include?.rooms ? { include: { room: true } } : true,
      },
    });
    return bookings.map(mapToEntity);
  },

  create: async (data: CreateBookingData): Promise<Booking> => {
    const code = data.code || (await bookingPrismaRepository.generateNextCode());
    const newBooking = await prisma.booking.create({
      data: {
        code,
        customerId: data.customerId || null,
        roomClass: data.roomClass,
        startDate: data.startDate,
        endDate: data.endDate,
        roomQuantity: data.roomQuantity,
        deposit: data.deposit,
        totalAmount: data.totalAmount,
        status: data.status,
        details: {
          create: data.details.map((d, index) => ({
            code: d.code || bookingPrismaRepository.generateNextDetailCode(index),
            roomId: d.roomId,
          })),
        },
      },
      include: {
        details: true,
      },
    });
    return mapToEntity(newBooking);
  },

  save: async (booking: Booking, include?: BookingInclude): Promise<Booking> => {
    const saved = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: booking.status,
        totalAmount: booking.totalAmount,
        deposit: booking.deposit,
        startDate: booking.startDate,
        endDate: booking.endDate,
        roomQuantity: booking.roomQuantity,
      },
      include: {
        customer: include?.customer || false,
        details: include?.rooms ? { include: { room: true } } : true,
      },
    });
    return mapToEntity(saved);
  },

  deleteById: async (id: string): Promise<void> => {
    await prisma.bookingDetail.deleteMany({ where: { bookingId: id } });
    await prisma.booking.delete({ where: { id } });
  },

  countAll: async (): Promise<number> => {
    return await prisma.booking.count();
  },

  generateNextCode: async (): Promise<string> => {
    const count = await prisma.booking.count();
    return `DP${(count + 1).toString().padStart(4, "0")}`;
  },

  generateNextDetailCode: (index: number): string => {
    return `CTDP${Date.now()}${index}`;
  },

  findOverlappingByRoom: async (roomId, startDate, endDate, excludeBookingId): Promise<Booking | null> => {
    const where: any = {
      details: {
        some: { roomId },
      },
      status: { in: ["Pending", "Confirmed", "CheckedIn"] },
      AND: [
        { startDate: { lt: endDate } },
        { endDate: { gt: startDate } },
      ],
    };

    if (excludeBookingId) {
      where.id = { not: excludeBookingId };
    }

    const overlapping = await prisma.booking.findFirst({ where });
    return overlapping ? mapToEntity(overlapping) : null;
  },

  updateStatus: async (id, status): Promise<void> => {
    await prisma.booking.update({
      where: { id },
      data: { status },
    });
  },
};

export default bookingPrismaRepository;
