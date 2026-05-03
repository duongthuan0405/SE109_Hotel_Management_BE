import { type IRoomRepository, type RoomInclude } from "../../types/IRoomRepository.js";
import { type Room, type RoomStatus } from "../../../models/Room.js";
import crypto from "crypto";
import roomTypeRepository from "./RoomTypeRepository.js";

let rooms: Room[] = [
  {
    id: "room-1",
    code: "101",
    roomTypeId: "1",
    price: 500000,
    status: "Available",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "room-2",
    code: "102",
    roomTypeId: "1",
    price: 500000,
    status: "Available",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "room-3",
    code: "103",
    roomTypeId: "2",
    price: 1200000,
    status: "Available",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const applyInclude = async (room: Room, include?: RoomInclude): Promise<Room> => {
  if (!include) return { ...room };

  const result = { ...room };

  if (include.roomType) {
    result.roomType = (await roomTypeRepository.findById(room.roomTypeId)) || undefined;
  }

  return result;
};

const roomRepository: IRoomRepository = {
  findAll: async (include): Promise<Room[]> => {
    return Promise.all(rooms.map((r) => applyInclude(r, include)));
  },

  findById: async (id, include): Promise<Room | null> => {
    const room = rooms.find((r) => r.id === id);
    if (!room) return null;
    return applyInclude(room, include);
  },

  findByCode: async (code, include): Promise<Room | null> => {
    const room = rooms.find((r) => r.code === code);
    if (!room) return null;
    return applyInclude(room, include);
  },

  findByRoomType: async (roomTypeId, include): Promise<Room[]> => {
    const filtered = rooms.filter((r) => r.roomTypeId === roomTypeId);
    return Promise.all(filtered.map((r) => applyInclude(r, include)));
  },

  create: async (roomData: Omit<Room, "id" | "createdAt" | "updatedAt" | "roomType" | "code"> & { code?: string | undefined }): Promise<Room> => {
    const code = roomData.code || (await roomRepository.generateNextCode());
    const newRoom: Room = {
      id: crypto.randomUUID(),
      ...roomData,
      code,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    rooms.push(newRoom);
    return { ...newRoom };
  },

  update: async (id, roomData, include): Promise<Room | null> => {
    const index = rooms.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const room = rooms[index]!;
    const updatedRoom: Room = {
      ...room,
      ...roomData,
      updatedAt: new Date(),
    } as Room;

    rooms[index] = updatedRoom;
    return applyInclude(updatedRoom, include);
  },

  updateStatus: async (id, status, include): Promise<Room | null> => {
    const index = rooms.findIndex((r) => r.id === id);
    if (index === -1) return null;
    const room = rooms[index]!;
    room.status = status;
    room.updatedAt = new Date();
    return applyInclude(room, include);
  },

  delete: async (id: string): Promise<boolean> => {
    const initialLength = rooms.length;
    rooms = rooms.filter((r) => r.id !== id);
    return rooms.length < initialLength;
  },
  generateNextCode: async (): Promise<string> => {
    const nextId = rooms.length + 1;
    return `R${String(nextId).padStart(3, "0")}`;
  },
};

export default roomRepository;
