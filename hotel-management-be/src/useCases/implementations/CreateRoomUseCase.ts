import { roomRepository } from "../../repository/index.js";
import type { ICreateRoomUseCase, CreateRoomUCInput, RoomUCOutput } from "../types/IRoomUseCases.js";

const createRoomUseCase: ICreateRoomUseCase = {
  execute: async (data: CreateRoomUCInput): Promise<RoomUCOutput> => {
    const existingRoom = await roomRepository.findByRoomNumber(data.roomNumber);
    if (existingRoom) {
      throw { status: 400, message: "Mã phòng đã tồn tại" };
    }

    return await roomRepository.create(data);
  },
};

export default createRoomUseCase;
