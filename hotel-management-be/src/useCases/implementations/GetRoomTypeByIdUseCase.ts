import { roomTypeRepository } from "../../repository/index.js";
import type { IGetRoomTypeByIdUseCase, GetRoomTypeByIdUCInput, RoomTypeUCOutput } from "../types/IRoomTypeUseCases.js";

const getRoomTypeByIdUseCase: IGetRoomTypeByIdUseCase = {
  execute: async (input: GetRoomTypeByIdUCInput): Promise<RoomTypeUCOutput> => {
    const roomType = await roomTypeRepository.findById(input.id);
    if (!roomType) {
      throw { status: 404, message: "Loại phòng không tồn tại" };
    }
    return roomType;
  },
};

export default getRoomTypeByIdUseCase;
