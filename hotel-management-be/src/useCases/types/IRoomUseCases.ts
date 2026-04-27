import type { Room, RoomStatus } from "../../models/Room.js";
import type { IUseCase } from "./IUseCase.js";

export type RoomUCOutput = Room;

export type IGetAllRoomsUseCase = IUseCase<void, RoomUCOutput[]>;

export type IGetRoomByIdUseCase = IUseCase<string, RoomUCOutput | null>;

export type CreateRoomUCInput = {
  roomNumber: string;
  roomTypeId: string;
  price: number;
  status: RoomStatus;
};
export type ICreateRoomUseCase = IUseCase<CreateRoomUCInput, RoomUCOutput>;

export type UpdateRoomUCInput = {
  id: string;
  roomNumber?: string;
  roomTypeId?: string;
  price?: number;
  status?: RoomStatus;
};
export type IUpdateRoomUseCase = IUseCase<UpdateRoomUCInput, RoomUCOutput | null>;

export type IDeleteRoomUseCase = IUseCase<string, boolean>;

export type UpdateRoomStatusUCInput = {
  id: string;
  status: RoomStatus;
};
export type IUpdateRoomStatusUseCase = IUseCase<UpdateRoomStatusUCInput, RoomUCOutput | null>;
