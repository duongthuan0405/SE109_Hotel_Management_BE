import { roomRepository } from "../../repository/index.js";
import type { IUpdateRoomUseCase, UpdateRoomUCInput, RoomUCOutput } from "../types/IRoomUseCases.js";

const updateRoomUseCase: IUpdateRoomUseCase = {
  execute: async (data: UpdateRoomUCInput): Promise<RoomUCOutput | null> => {
    const { id, ...updateData } = data;
    const room = await roomRepository.findById(id);
    if (!room) {
      throw { status: 404, message: "Không tìm thấy phòng" };
    }

    return await roomRepository.update(id, updateData);
  },
};

export default updateRoomUseCase;
