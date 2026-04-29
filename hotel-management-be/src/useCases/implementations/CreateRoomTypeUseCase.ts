import { roomTypeRepository } from "../../repository/index.js";
import type { ICreateRoomTypeUseCase, CreateRoomTypeUCInput, RoomTypeUCOutput } from "../types/IRoomTypeUseCases.js";

const createRoomTypeUseCase: ICreateRoomTypeUseCase = {
  execute: async (input: CreateRoomTypeUCInput): Promise<RoomTypeUCOutput> => {
    return await roomTypeRepository.create({
      name: input.name,
      price: input.price,
      maxOccupancy: input.maxOccupancy,
    });
  },
};

export default createRoomTypeUseCase;
