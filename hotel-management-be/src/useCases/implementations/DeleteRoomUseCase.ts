import { roomRepository } from "../../repository/index.js";
import type { IDeleteRoomUseCase } from "../types/IRoomUseCases.js";

const deleteRoomUseCase: IDeleteRoomUseCase = {
  execute: async (id: string): Promise<boolean> => {
    const room = await roomRepository.findById(id);
    if (!room) {
      throw { status: 404, message: "Không tìm thấy phòng" };
    }

    return await roomRepository.delete(id);
  },
};

export default deleteRoomUseCase;
