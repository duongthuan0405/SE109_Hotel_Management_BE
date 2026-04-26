import { roomTypeRepository } from "../../repository/index.js";
import type { IDeleteRoomTypeUseCase, DeleteRoomTypeUCInput, RoomTypeUCOutput } from "../types/IRoomTypeUseCases.js";

const deleteRoomTypeUseCase: IDeleteRoomTypeUseCase = {
  execute: async (input: DeleteRoomTypeUCInput): Promise<RoomTypeUCOutput> => {
    const roomType = await roomTypeRepository.findById(input.id);
    if (!roomType) {
      throw { status: 404, message: "Loại phòng không tồn tại" };
    }

    await roomTypeRepository.deleteById(input.id);
    return roomType;
  },
};

export default deleteRoomTypeUseCase;
