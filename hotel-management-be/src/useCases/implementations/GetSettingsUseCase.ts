import { type IGetSettingsUseCase } from "../types/ISettingsUseCases.js";
import { type Settings } from "../../models/Settings.js";
import { settingsRepository } from "../../repository/index.js";

export const getSettings: IGetSettingsUseCase = {
  execute: async (): Promise<Settings> => {
    let settings = await settingsRepository.findByKey("GeneralSettings");
    if (!settings) {
      // Tạo mặc định nếu chưa tồn tại
      settings = await settingsRepository.upsert("GeneralSettings", {});
    }
    return settings;
  },
};
