import {
  type IUpdateSettingsUseCase,
  type UpdateSettingsUCInput,
} from "../types/ISettingsUseCases.js";
import { type Settings } from "../../models/Settings.js";
import { settingsRepository, roomTypeRepository, roomRepository } from "../../repository/index.js";

export const updateSettings: IUpdateSettingsUseCase = {
  execute: async (input: UpdateSettingsUCInput): Promise<Settings> => {
    // Loại bỏ các property undefined để pass được luật exactOptionalPropertyTypes
    const dataToUpsert: any = {};
    if (input.hotelInfo) dataToUpsert.hotelInfo = input.hotelInfo;
    if (input.timeConfig) dataToUpsert.timeConfig = input.timeConfig;
    if (input.taxConfig) dataToUpsert.taxConfig = input.taxConfig;
    if (input.baseRoomPrices) dataToUpsert.baseRoomPrices = input.baseRoomPrices;

    const updated = await settingsRepository.upsert("GeneralSettings", dataToUpsert);

    // SYNC: Cập nhật giá phòng sang tất cả Room khi GiaPhongCoBan thay đổi
    // Logic giống cũ: RoomType.name → tìm rooms thuộc hạng đó → cập nhật giá
    if (input.baseRoomPrices) {
      const typesToSync = ["Normal", "Standard", "Premium", "Luxury"] as const;

      for (const typeName of typesToSync) {
        const newPrice = input.baseRoomPrices[typeName];
        if (newPrice === undefined) continue;

        // Tìm RoomType theo tên (giống logic cũ: LoaiPhong.findOne({ TenLoaiPhong: typeName }))
        const allRoomTypes = await roomTypeRepository.findAll();
        const roomType = allRoomTypes.find((rt) => rt.name === typeName);

        if (roomType) {
          // Cập nhật giá tất cả phòng thuộc hạng này
          const rooms = await roomRepository.findByRoomType(roomType.id);
          for (const room of rooms) {
            await roomRepository.update(room.id, { price: newPrice });
          }
        }
      }
    }

    return updated;
  },
};
