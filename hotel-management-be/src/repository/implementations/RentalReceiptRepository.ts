import { type IRentalReceiptRepository } from "../types/IRentalReceiptRepository.js";
import { type RentalSlip } from "../../models/RentalSlip.js";
import crypto from "crypto";

let rentalSlips: RentalSlip[] = [];

const rentalReceiptRepository: IRentalReceiptRepository = {
  create: async (data): Promise<RentalSlip> => {
    const newSlip: RentalSlip = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    rentalSlips.push(newSlip);
    return { ...newSlip };
  },

  findById: async (id): Promise<RentalSlip | null> => {
    return rentalSlips.find((s) => s.id === id) || null;
  },

  findBySlipCode: async (slipCode): Promise<RentalSlip | null> => {
    return rentalSlips.find((s) => s.slipCode === slipCode) || null;
  },

  findAll: async (): Promise<RentalSlip[]> => {
    return [...rentalSlips];
  },

  update: async (id, data): Promise<RentalSlip | null> => {
    const index = rentalSlips.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const slip = rentalSlips[index];
    const updatedSlip: RentalSlip = {
      ...slip,
      ...data,
      updatedAt: new Date(),
    } as RentalSlip;

    rentalSlips[index] = updatedSlip;
    return { ...updatedSlip };
  },

  delete: async (id): Promise<boolean> => {
    const initialLength = rentalSlips.length;
    rentalSlips = rentalSlips.filter((s) => s.id !== id);
    return rentalSlips.length < initialLength;
  },

  countAll: async (): Promise<number> => {
    return rentalSlips.length;
  },
};

export default rentalReceiptRepository;
