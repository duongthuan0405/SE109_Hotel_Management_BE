import { roomTypeRepository } from "../../repository/index.js";
import type { IUpdateRoomTypeUseCase, UpdateRoomTypeUCInput, RoomTypeUCOutput } from "../types/IRoomTypeUseCases.js";

const updateRoomTypeUseCase: IUpdateRoomTypeUseCase = {
  execute: async (input: UpdateRoomTypeUCInput): Promise<RoomTypeUCOutput> => {
    const roomType = await roomTypeRepository.findById(input.id);
    if (!roomType) {
      throw { status: 404, message: "Loại phòng không tồn tại" };
    }

    if (input.name !== undefined) {
      roomType.name = input.name;
    }

    if (input.price !== undefined) {
      roomType.price = input.price;
    }

    if (input.maxOccupancy !== undefined) {
      roomType.maxOccupancy = input.maxOccupancy;
    }

    return await roomTypeRepository.save(roomType);
  },
};

export default updateRoomTypeUseCase;
