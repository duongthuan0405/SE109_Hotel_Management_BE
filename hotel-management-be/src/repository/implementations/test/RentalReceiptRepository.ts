import { type IRentalReceiptRepository, type RentalReceiptInclude } from "../../types/IRentalReceiptRepository.js";
import { type RentalSlip } from "../../../models/RentalSlip.js";
import crypto from "crypto";
import bookingRepository from "./BookingRepository.js";
import roomRepository from "./RoomRepository.js";
import staffRepository from "./StaffRepository.js";

let rentalSlips: RentalSlip[] = [];

const applyInclude = async (slip: RentalSlip, include?: RentalReceiptInclude): Promise<RentalSlip> => {
  if (!include) return { ...slip };

  const result = { ...slip };

  if (include.booking) {
    result.booking = (await bookingRepository.findById(slip.bookingId)) || undefined;
  }
  if (include.room) {
    result.room = (await roomRepository.findById(slip.roomId)) || undefined;
  }
  if (include.checkInStaff) {
    result.checkInStaff = (await staffRepository.findById(slip.checkInStaffId)) || undefined;
  }

  return result;
};

const rentalReceiptRepository: IRentalReceiptRepository = {
  create: async (data: Omit<RentalSlip, "id" | "createdAt" | "updatedAt" | "booking" | "room" | "checkInStaff" | "code"> & { code?: string | undefined }): Promise<RentalSlip> => {
    const code = data.code || (await rentalReceiptRepository.generateNextCode());
    const newSlip: RentalSlip = {
      id: crypto.randomUUID(),
      ...data,
      code,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    rentalSlips.push(newSlip);
    return { ...newSlip };
  },

  findById: async (id, include): Promise<RentalSlip | null> => {
    const slip = rentalSlips.find((s) => s.id === id);
    if (!slip) return null;
    return applyInclude(slip, include);
  },

  findByCode: async (code, include): Promise<RentalSlip | null> => {
    const slip = rentalSlips.find((s) => s.code === code);
    if (!slip) return null;
    return applyInclude(slip, include);
  },

  findAll: async (include): Promise<RentalSlip[]> => {
    return Promise.all(rentalSlips.map((slip) => applyInclude(slip, include)));
  },

  findByBookingId: async (bookingId: string, include?: RentalReceiptInclude): Promise<RentalSlip[]> => {
    const filtered = rentalSlips.filter((slip) => slip.bookingId === bookingId);
    return Promise.all(filtered.map((slip) => applyInclude(slip, include)));
  },

  update: async (id, data, include): Promise<RentalSlip | null> => {
    const index = rentalSlips.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const slip = rentalSlips[index]!;
    const updatedSlip: RentalSlip = {
      ...slip,
      ...data,
      updatedAt: new Date(),
    } as RentalSlip;

    rentalSlips[index] = updatedSlip;
    return applyInclude(updatedSlip, include);
  },

  delete: async (id): Promise<boolean> => {
    const initialLength = rentalSlips.length;
    rentalSlips = rentalSlips.filter((s) => s.id !== id);
    return rentalSlips.length < initialLength;
  },

  countAll: async (): Promise<number> => {
    return rentalSlips.length;
  },
  generateNextCode: async (): Promise<string> => {
    const nextId = rentalSlips.length + 1;
    return `PTP${String(nextId).padStart(3, "0")}`;
  },
};

export default rentalReceiptRepository;
