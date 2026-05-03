import { type Room, type RoomStatus } from "../../../models/Room.js";
import { type IRoomRepository, type RoomInclude } from "../../types/IRoomRepository.js";
import prisma from "../../../config/prisma.js";

const mapToEntity = (room: any): Room => ({
  id: room.id,
  code: room.code,
  roomTypeId: room.roomTypeId,
  price: room.price,
  status: room.status as RoomStatus,
  createdAt: room.createdAt,
  updatedAt: room.updatedAt,
  roomType: room.roomType ? {
    id: room.roomType.id,
    code: room.roomType.code,
    name: room.roomType.name,
    price: room.roomType.price,
    maxOccupancy: room.roomType.maxOccupancy,
  } : undefined,
});

const roomPrismaRepository: IRoomRepository = {
  create: async (room: Omit<Room, "id" | "createdAt" | "updatedAt" | "roomType" | "code"> & { code?: string | undefined }): Promise<Room> => {
    const code = room.code || (await roomPrismaRepository.generateNextCode());
    const newRoom = await prisma.room.create({
      data: {
        code,
        roomTypeId: room.roomTypeId,
        price: room.price,
        status: room.status,
      },
      include: {
        roomType: true,
      },
    });
    return mapToEntity(newRoom);
  },

  findById: async (id: string, include?: RoomInclude): Promise<Room | null> => {
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        roomType: include?.roomType || false,
      },
    });
    return room ? mapToEntity(room) : null;
  },

  findByCode: async (code: string, include?: RoomInclude): Promise<Room | null> => {
    const room = await prisma.room.findUnique({
      where: { code },
      include: {
        roomType: include?.roomType || false,
      },
    });
    return room ? mapToEntity(room) : null;
  },

  findAll: async (include?: RoomInclude): Promise<Room[]> => {
    const rooms = await prisma.room.findMany({
      include: {
        roomType: include?.roomType || false,
      },
    });
    return rooms.map(mapToEntity);
  },

  update: async (id: string, room: Partial<Omit<Room, "id" | "createdAt" | "updatedAt" | "roomType">>, include?: RoomInclude): Promise<Room | null> => {
    const updateData: any = {};
    if (room.roomTypeId !== undefined) updateData.roomTypeId = room.roomTypeId;
    if (room.price !== undefined) updateData.price = room.price;
    if (room.status !== undefined) updateData.status = room.status;
    if (room.code !== undefined) updateData.code = room.code;

    const updated = await prisma.room.update({
      where: { id },
      data: updateData,
      include: {
        roomType: include?.roomType || false,
      },
    });
    return mapToEntity(updated);
  },

  updateStatus: async (id: string, status: RoomStatus, include?: RoomInclude): Promise<Room | null> => {
    const updated = await prisma.room.update({
      where: { id },
      data: { status },
      include: {
        roomType: include?.roomType || false,
      },
    });
    return mapToEntity(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await prisma.room.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },

  findByRoomType: async (roomTypeId: string, include?: RoomInclude): Promise<Room[]> => {
    const rooms = await prisma.room.findMany({
      where: { roomTypeId },
      include: {
        roomType: include?.roomType || false,
      },
    });
    return rooms.map(mapToEntity);
  },

  generateNextCode: async (): Promise<string> => {
    const count = await prisma.room.count();
    return `P${(count + 1).toString().padStart(3, "0")}`;
  },
};

export default roomPrismaRepository;
