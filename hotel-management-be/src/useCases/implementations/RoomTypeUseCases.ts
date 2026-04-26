import { roomTypeRepository } from "../../repository/index.js";
import type {
  IGetAllRoomTypesUseCase,
  IGetRoomTypeByIdUseCase,
  GetRoomTypeByIdUCInput,
  ICreateRoomTypeUseCase,
  CreateRoomTypeUCInput,
  IUpdateRoomTypeUseCase,
  UpdateRoomTypeUCInput,
  IDeleteRoomTypeUseCase,
  DeleteRoomTypeUCInput,
  RoomTypeUCOutput,
} from "../types/IRoomTypeUseCases.js";

export const getAllRoomTypesUseCase: IGetAllRoomTypesUseCase = {
  execute: async (): Promise<RoomTypeUCOutput[]> => {
    return await roomTypeRepository.findAll();
  },
};

export const getRoomTypeByIdUseCase: IGetRoomTypeByIdUseCase = {
  execute: async (input: GetRoomTypeByIdUCInput): Promise<RoomTypeUCOutput> => {
    const roomType = await roomTypeRepository.findById(input.id);
    if (!roomType) {
      throw { status: 404, message: "Loại phòng không tồn tại" };
    }
    return roomType;
  },
};

export const createRoomTypeUseCase: ICreateRoomTypeUseCase = {
  execute: async (input: CreateRoomTypeUCInput): Promise<RoomTypeUCOutput> => {
    const existing = await roomTypeRepository.findByCode(input.code);
    if (existing) {
      throw { status: 400, message: "Mã loại phòng đã tồn tại" };
    }
    
    return await roomTypeRepository.create({
      code: input.code,
      name: input.name,
    });
  },
};

export const updateRoomTypeUseCase: IUpdateRoomTypeUseCase = {
  execute: async (input: UpdateRoomTypeUCInput): Promise<RoomTypeUCOutput> => {
    const roomType = await roomTypeRepository.findById(input.id);
    if (!roomType) {
      throw { status: 404, message: "Loại phòng không tồn tại" };
    }

    if (input.code !== undefined && input.code !== roomType.code) {
      const existing = await roomTypeRepository.findByCode(input.code);
      if (existing) {
        throw { status: 400, message: "Mã loại phòng đã tồn tại" };
      }
      roomType.code = input.code;
    }

    if (input.name !== undefined) {
      roomType.name = input.name;
    }

    return await roomTypeRepository.save(roomType);
  },
};

export const deleteRoomTypeUseCase: IDeleteRoomTypeUseCase = {
  execute: async (input: DeleteRoomTypeUCInput): Promise<void> => {
    const roomType = await roomTypeRepository.findById(input.id);
    if (!roomType) {
      throw { status: 404, message: "Loại phòng không tồn tại" };
    }

    await roomTypeRepository.deleteById(input.id);
  },
};
