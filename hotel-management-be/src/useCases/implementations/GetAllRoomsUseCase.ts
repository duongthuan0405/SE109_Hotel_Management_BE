import { roomRepository } from "../../repository/index.js";
import type { IGetAllRoomsUseCase, RoomUCOutput } from "../types/IRoomUseCases.js";

const getAllRoomsUseCase: IGetAllRoomsUseCase = {
  execute: async (): Promise<RoomUCOutput[]> => {
    return await roomRepository.findAll({ roomType: true });
  },
};

export default getAllRoomsUseCase;
