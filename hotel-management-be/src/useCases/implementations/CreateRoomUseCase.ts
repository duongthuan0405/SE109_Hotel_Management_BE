import { roomRepository } from "../../repository/index.js";
import type { ICreateRoomUseCase, CreateRoomUCInput, RoomUCOutput } from "../types/IRoomUseCases.js";

const createRoomUseCase: ICreateRoomUseCase = {
  execute: async (data: CreateRoomUCInput): Promise<RoomUCOutput> => {
    const existingRoom = await roomRepository.findByCode(data.code);
    if (existingRoom) {
      throw { status: 400, message: "Mã phòng đã tồn tại" };
    }

    const newRoom = await roomRepository.create(data);
    return (await roomRepository.findById(newRoom.id, { roomType: true }))!;
  },
};

export default createRoomUseCase;
