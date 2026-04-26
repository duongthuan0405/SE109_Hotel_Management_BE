import type { Room, RoomStatus } from "../../models/Room.js";
export type RoomUCOutput = Room;

export interface IGetAllRoomsUseCase {
  execute(): Promise<RoomUCOutput[]>;
}

export interface IGetRoomByIdUseCase {
  execute(id: string): Promise<RoomUCOutput | null>;
}

export type CreateRoomUCInput = {
  roomNumber: string;
  roomTypeId: string;
  price: number;
  status: RoomStatus;
};

export interface ICreateRoomUseCase {
  execute(data: CreateRoomUCInput): Promise<RoomUCOutput>;
}

export type UpdateRoomUCInput = {
  id: string;
  roomNumber?: string;
  roomTypeId?: string;
  price?: number;
  status?: RoomStatus;
};

export interface IUpdateRoomUseCase {
  execute(data: UpdateRoomUCInput): Promise<RoomUCOutput | null>;
}

export interface IDeleteRoomUseCase {
  execute(id: string): Promise<boolean>;
}

export interface IUpdateRoomStatusUseCase {
  execute(id: string, status: RoomStatus): Promise<RoomUCOutput | null>;
}
