import { roomTypeRepository } from "../../repository/index.js";
import type { IGetAllRoomTypesUseCase, RoomTypeUCOutput } from "../types/IRoomTypeUseCases.js";

const getAllRoomTypesUseCase: IGetAllRoomTypesUseCase = {
  execute: async (): Promise<RoomTypeUCOutput[]> => {
    return await roomTypeRepository.findAll();
  },
};

export default getAllRoomTypesUseCase;
