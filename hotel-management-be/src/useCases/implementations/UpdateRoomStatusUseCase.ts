import type { RoomStatus } from "../../models/Room.js";
import { roomRepository } from "../../repository/index.js";
import type { IUpdateRoomStatusUseCase, RoomUCOutput } from "../types/IRoomUseCases.js";

const updateRoomStatusUseCase: IUpdateRoomStatusUseCase = {
  execute: async (id: string, status: RoomStatus): Promise<RoomUCOutput | null> => {
    const room = await roomRepository.findById(id);
    if (!room) {
      throw { status: 404, message: "Không tìm thấy phòng" };
    }

    return await roomRepository.update(id, { status });
  },
};

export default updateRoomStatusUseCase;
