import { roomRepository } from "../../repository/index.js";
import type { IGetRoomByIdUseCase, RoomUCOutput } from "../types/IRoomUseCases.js";

const getRoomByIdUseCase: IGetRoomByIdUseCase = {
  execute: async (id: string): Promise<RoomUCOutput | null> => {
    return await roomRepository.findById(id, { roomType: true });
  },
};

export default getRoomByIdUseCase;
