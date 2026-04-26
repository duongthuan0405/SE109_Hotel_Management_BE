import { roomTypeRepository } from "../../repository/index.js";
import type { IUpdateRoomTypeUseCase, UpdateRoomTypeUCInput, RoomTypeUCOutput } from "../types/IRoomTypeUseCases.js";

const updateRoomTypeUseCase: IUpdateRoomTypeUseCase = {
  execute: async (input: UpdateRoomTypeUCInput): Promise<RoomTypeUCOutput> => {
    const roomType = await roomTypeRepository.findById(input.id);
    if (!roomType) {
      throw { status: 404, message: "Loại phòng không tồn tại" };
    }

    if (input.code !== undefined && input.code !== roomType.code) {
      const existing = await roomTypeRepository.findByCode(input.code);
      if (existing) {
        throw { status: 409, message: "Mã loại phòng đã tồn tại" };
      }
      roomType.code = input.code;
    }

    if (input.name !== undefined) {
      roomType.name = input.name;
    }

    return await roomTypeRepository.save(roomType);
  },
};

export default updateRoomTypeUseCase;
