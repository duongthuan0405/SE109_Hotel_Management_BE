import { roomRepository } from "../../repository/index.js";
import type { IUpdateRoomUseCase, UpdateRoomUCInput, RoomUCOutput } from "../types/IRoomUseCases.js";

const updateRoomUseCase: IUpdateRoomUseCase = {
  execute: async (data: UpdateRoomUCInput): Promise<RoomUCOutput | null> => {
    const { id, ...updateData } = data;
    const room = await roomRepository.findById(id);
    if (!room) {
      throw { status: 404, message: "Không tìm thấy phòng" };
    }

    if (updateData.code && updateData.code !== room.code) {
      const existingRoom = await roomRepository.findByCode(updateData.code);
      if (existingRoom) {
        throw { status: 400, message: "Mã phòng đã tồn tại" };
      }
    }

    return await roomRepository.update(id, updateData);
  },
};

export default updateRoomUseCase;
