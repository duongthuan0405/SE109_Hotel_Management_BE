import { type RentalSlip, type RentalSlipStatus } from "../../../models/RentalSlip.js";
import { type IRentalReceiptRepository, type RentalReceiptInclude } from "../../types/IRentalReceiptRepository.js";
import prisma from "../../../config/prisma.js";

const mapToEntity = (slip: any): RentalSlip => ({
  id: slip.id,
  code: slip.code,
  bookingId: slip.bookingId,
  roomId: slip.roomId,
  checkInDate: slip.checkInDate,
  expectedCheckOutDate: slip.expectedCheckOutDate,
  actualGuestCount: slip.actualGuestCount,
  adjustedPrice: slip.adjustedPrice,
  checkInStaffId: slip.checkInStaffId,
  status: slip.status as RentalSlipStatus,
  createdAt: slip.createdAt,
  updatedAt: slip.updatedAt,
  booking: slip.booking ? {
    id: slip.booking.id,
    code: slip.booking.code,
    roomClass: slip.booking.roomClass,
    startDate: slip.booking.startDate,
    endDate: slip.booking.endDate,
    guestCount: slip.booking.guestCount,
    deposit: slip.booking.deposit,
    totalAmount: slip.booking.totalAmount,
    status: slip.booking.status,
    details: [],
    createdAt: slip.booking.createdAt,
    updatedAt: slip.booking.updatedAt,
  } : undefined,
  room: slip.room ? {
    id: slip.room.id,
    code: slip.room.code,
    roomTypeId: slip.room.roomTypeId,
    price: slip.room.price,
    status: slip.room.status,
    createdAt: slip.room.createdAt,
    updatedAt: slip.room.updatedAt,
  } : undefined,
  checkInStaff: slip.checkInStaff ? {
    id: slip.checkInStaff.id,
    code: slip.checkInStaff.code,
    fullName: slip.checkInStaff.fullName,
    position: slip.checkInStaff.position,
    phone: slip.checkInStaff.phone,
    email: slip.checkInStaff.email,
    userId: slip.checkInStaff.userId,
    createdAt: slip.checkInStaff.createdAt,
    updatedAt: slip.checkInStaff.updatedAt,
  } : undefined,
});

const rentalReceiptPrismaRepository: IRentalReceiptRepository = {
  create: async (data: Omit<RentalSlip, "id" | "createdAt" | "updatedAt" | "booking" | "room" | "checkInStaff" | "code"> & { code?: string | undefined }): Promise<RentalSlip> => {
    const code = data.code || (await rentalReceiptPrismaRepository.generateNextCode());
    const newSlip = await prisma.rentalSlip.create({
      data: {
        code,
        bookingId: data.bookingId,
        roomId: data.roomId,
        checkInDate: data.checkInDate,
        expectedCheckOutDate: data.expectedCheckOutDate,
        actualGuestCount: data.actualGuestCount,
        adjustedPrice: data.adjustedPrice,
        checkInStaffId: data.checkInStaffId,
        status: data.status,
      },
      include: {
        booking: true,
        room: true,
        checkInStaff: true,
      },
    });
    return mapToEntity(newSlip);
  },

  findById: async (id: string, include?: RentalReceiptInclude): Promise<RentalSlip | null> => {
    const slip = await prisma.rentalSlip.findUnique({
      where: { id },
      include: {
        booking: include?.booking || false,
        room: include?.room || false,
        checkInStaff: include?.checkInStaff || false,
      },
    });
    return slip ? mapToEntity(slip) : null;
  },

  findByCode: async (code: string, include?: RentalReceiptInclude): Promise<RentalSlip | null> => {
    const slip = await prisma.rentalSlip.findUnique({
      where: { code },
      include: {
        booking: include?.booking || false,
        room: include?.room || false,
        checkInStaff: include?.checkInStaff || false,
      },
    });
    return slip ? mapToEntity(slip) : null;
  },

  findAll: async (include?: RentalReceiptInclude): Promise<RentalSlip[]> => {
    const slips = await prisma.rentalSlip.findMany({
      include: {
        booking: include?.booking || false,
        room: include?.room || false,
        checkInStaff: include?.checkInStaff || false,
      },
    });
    return slips.map(mapToEntity);
  },

  findByBookingId: async (bookingId: string, include?: RentalReceiptInclude): Promise<RentalSlip[]> => {
    const slips = await prisma.rentalSlip.findMany({
      where: { bookingId },
      include: {
        booking: include?.booking || false,
        room: include?.room || false,
        checkInStaff: include?.checkInStaff || false,
      },
    });
    return slips.map(mapToEntity);
  },

  update: async (id: string, data: Partial<Omit<RentalSlip, "id" | "createdAt" | "updatedAt" | "booking" | "room" | "checkInStaff">>, include?: RentalReceiptInclude): Promise<RentalSlip | null> => {
    const updateData: any = {};
    if (data.bookingId !== undefined) updateData.bookingId = data.bookingId;
    if (data.roomId !== undefined) updateData.roomId = data.roomId;
    if (data.checkInDate !== undefined) updateData.checkInDate = data.checkInDate;
    if (data.expectedCheckOutDate !== undefined) updateData.expectedCheckOutDate = data.expectedCheckOutDate;
    if (data.actualGuestCount !== undefined) updateData.actualGuestCount = data.actualGuestCount;
    if (data.adjustedPrice !== undefined) updateData.adjustedPrice = data.adjustedPrice;
    if (data.checkInStaffId !== undefined) updateData.checkInStaffId = data.checkInStaffId;
    if (data.status !== undefined) updateData.status = data.status;

    const updated = await prisma.rentalSlip.update({
      where: { id },
      data: updateData,
      include: {
        booking: include?.booking || false,
        room: include?.room || false,
        checkInStaff: include?.checkInStaff || false,
      },
    });
    return mapToEntity(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await prisma.rentalSlip.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },

  countAll: async (): Promise<number> => {
    return await prisma.rentalSlip.count();
  },

  generateNextCode: async (): Promise<string> => {
    const count = await prisma.rentalSlip.count();
    return `PTP${(count + 1).toString().padStart(4, "0")}`;
  },
};

export default rentalReceiptPrismaRepository;
