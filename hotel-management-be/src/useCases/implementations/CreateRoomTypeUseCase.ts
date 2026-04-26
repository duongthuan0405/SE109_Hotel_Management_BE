import { roomTypeRepository } from "../../repository/index.js";
import type { ICreateRoomTypeUseCase, CreateRoomTypeUCInput, RoomTypeUCOutput } from "../types/IRoomTypeUseCases.js";

const createRoomTypeUseCase: ICreateRoomTypeUseCase = {
  execute: async (input: CreateRoomTypeUCInput): Promise<RoomTypeUCOutput> => {
    const existing = await roomTypeRepository.findByCode(input.code);
    if (existing) {
      throw { status: 409, message: "Mã loại phòng đã tồn tại" };
    }
    
    return await roomTypeRepository.create({
      code: input.code,
      name: input.name,
      price: input.price,
      maxOccupancy: input.maxOccupancy,
    });
  },
};

export default createRoomTypeUseCase;
