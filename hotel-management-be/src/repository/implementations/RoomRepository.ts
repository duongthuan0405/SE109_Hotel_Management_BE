import { type IRoomRepository } from "../types/IRoomRepository.js";
import { type Room, type RoomStatus } from "../../models/Room.js";
import crypto from "crypto";

let rooms: Room[] = [
  {
    id: "room-1",
    roomNumber: "101",
    roomTypeId: "1",
    price: 500000,
    status: "Available",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "room-2",
    roomNumber: "102",
    roomTypeId: "1",
    price: 500000,
    status: "Occupied",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const roomRepository: IRoomRepository = {
  findAll: async (): Promise<Room[]> => {
    return [...rooms];
  },

  findById: async (id: string): Promise<Room | null> => {
    return rooms.find((r) => r.id === id) || null;
  },

  findByRoomNumber: async (roomNumber: string): Promise<Room | null> => {
    return rooms.find((r) => r.roomNumber === roomNumber) || null;
  },

  findByRoomType: async (roomTypeId: string): Promise<Room[]> => {
    return rooms.filter((r) => r.roomTypeId === roomTypeId);
  },

  create: async (roomData: Omit<Room, "id" | "createdAt" | "updatedAt">): Promise<Room> => {
    const newRoom: Room = {
      id: crypto.randomUUID(),
      roomNumber: roomData.roomNumber,
      roomTypeId: roomData.roomTypeId,
      price: roomData.price,
      status: roomData.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    rooms.push(newRoom);
    return { ...newRoom };
  },

  update: async (id: string, roomData: Partial<Omit<Room, "id" | "createdAt" | "updatedAt">>): Promise<Room | null> => {
    const index = rooms.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const room = rooms[index];
    if (!room) return null;

    const updatedRoom: Room = {
      id: room.id,
      roomNumber: roomData.roomNumber ?? room.roomNumber,
      roomTypeId: roomData.roomTypeId ?? room.roomTypeId,
      price: roomData.price ?? room.price,
      status: roomData.status ?? room.status,
      createdAt: room.createdAt,
      updatedAt: new Date(),
    };

    rooms[index] = updatedRoom;
    return { ...updatedRoom };
  },

  updateStatus: async (id: string, status: RoomStatus): Promise<Room | null> => {
    const index = rooms.findIndex((r) => r.id === id);
    if (index === -1) return null;
    const room = rooms[index];
    if (!room) return null;
    room.status = status;
    room.updatedAt = new Date();
    return { ...room };
  },

  delete: async (id: string): Promise<boolean> => {
    const initialLength = rooms.length;
    rooms = rooms.filter((r) => r.id !== id);
    return rooms.length < initialLength;
  },
};

export default roomRepository;
