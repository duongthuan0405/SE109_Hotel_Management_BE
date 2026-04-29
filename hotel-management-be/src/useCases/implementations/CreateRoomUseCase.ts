import { roomRepository } from "../../repository/index.js";
import type { ICreateRoomUseCase, CreateRoomUCInput, RoomUCOutput } from "../types/IRoomUseCases.js";

const createRoomUseCase: ICreateRoomUseCase = {
  execute: async (data: CreateRoomUCInput): Promise<RoomUCOutput> => {
    const newRoom = await roomRepository.create(data);
    return (await roomRepository.findById(newRoom.id, { roomType: true }))!;
  },
};

export default createRoomUseCase;
