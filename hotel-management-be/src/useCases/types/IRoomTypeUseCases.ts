import { type IUseCase } from "./IUseCase.js";
import { type RoomType } from "../../models/RoomType.js";

export type RoomTypeUCOutput = RoomType;

export type IGetAllRoomTypesUseCase = IUseCase<void, RoomTypeUCOutput[]>;

export type GetRoomTypeByIdUCInput = { id: string };
export type IGetRoomTypeByIdUseCase = IUseCase<GetRoomTypeByIdUCInput, RoomTypeUCOutput>;

export type CreateRoomTypeUCInput = {
  code: string;
  name: string;
  price: number;
  maxOccupancy: number;
};
export type ICreateRoomTypeUseCase = IUseCase<CreateRoomTypeUCInput, RoomTypeUCOutput>;

export type UpdateRoomTypeUCInput = {
  id: string;
  code?: string | undefined;
  name?: string | undefined;
  price?: number | undefined;
  maxOccupancy?: number | undefined;
};
export type IUpdateRoomTypeUseCase = IUseCase<UpdateRoomTypeUCInput, RoomTypeUCOutput>;

export type DeleteRoomTypeUCInput = { id: string };
export type IDeleteRoomTypeUseCase = IUseCase<DeleteRoomTypeUCInput, RoomTypeUCOutput>;
