import { type IRoomTypeRepository } from "../../types/IRoomTypeRepository.js";
import { type RoomType } from "../../../models/RoomType.js";
import crypto from "crypto";

// Mock data
let roomTypes: RoomType[] = [
  { id: "1", code: "STD", name: "Phòng Tiêu Chuẩn", price: 500000, maxOccupancy: 2 },
  { id: "2", code: "VIP", name: "Phòng VIP", price: 1200000, maxOccupancy: 4 },
];

const roomTypeRepository: IRoomTypeRepository = {
  findAll: async (): Promise<RoomType[]> => {
    return [...roomTypes];
  },

  findById: async (id: string): Promise<RoomType | null> => {
    const roomType = roomTypes.find((rt) => rt.id === id);
    return roomType ? { ...roomType } : null;
  },

  findByCode: async (code: string): Promise<RoomType | null> => {
    const roomType = roomTypes.find((rt) => rt.code === code);
    return roomType ? { ...roomType } : null;
  },

  create: async (roomTypeData: Omit<RoomType, "id" | "code"> & { code?: string | undefined }): Promise<RoomType> => {
    const code = roomTypeData.code || (await roomTypeRepository.generateNextCode());
    const newRoomType: RoomType = {
      id: crypto.randomUUID(),
      ...roomTypeData,
      code,
    };
    roomTypes.push(newRoomType);
    return { ...newRoomType };
  },

  save: async (roomType: RoomType): Promise<RoomType> => {
    const index = roomTypes.findIndex((rt) => rt.id === roomType.id);
    if (index !== -1) {
      roomTypes[index] = { ...roomType };
    }
    return { ...roomType };
  },

  deleteById: async (id: string): Promise<boolean> => {
    const initialLength = roomTypes.length;
    roomTypes = roomTypes.filter((rt) => rt.id !== id);
    return roomTypes.length < initialLength;
  },
  generateNextCode: async (): Promise<string> => {
    const nextId = roomTypes.length + 1;
    return `RT${String(nextId).padStart(3, "0")}`;
  },
};

export default roomTypeRepository;
