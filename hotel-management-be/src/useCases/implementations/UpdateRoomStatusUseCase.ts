import { roomRepository } from "../../repository/index.js";
import type { IUpdateRoomStatusUseCase, RoomUCOutput, UpdateRoomStatusUCInput } from "../types/IRoomUseCases.js";

const updateRoomStatusUseCase: IUpdateRoomStatusUseCase = {
  execute: async (input: UpdateRoomStatusUCInput): Promise<RoomUCOutput | null> => {
    const { id, status } = input;
    const room = await roomRepository.findById(id);
    if (!room) {
      throw { status: 404, message: "Không tìm thấy phòng" };
    }

    return await roomRepository.update(id, { status });
  },
};

export default updateRoomStatusUseCase;
