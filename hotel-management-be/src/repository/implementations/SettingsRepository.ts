import { type ISettingsRepository } from "../types/ISettingsRepository.js";
import { type Settings } from "../../models/Settings.js";

const DEFAULT_SETTINGS: Settings = {
  id: "settings-1",
  key: "GeneralSettings",
  hotelInfo: {
    name: "",
    address: "",
    phone: "",
    email: "",
  },
  timeConfig: {
    checkInTime: "14:00",
    checkOutTime: "12:00",
  },
  taxConfig: {
    vatRate: 10,
    serviceFeeRate: 5,
  },
  baseRoomPrices: {
    Normal: 400000,
    Standard: 600000,
    Premium: 900000,
    Luxury: 1500000,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

let settingsStore: Settings = { ...DEFAULT_SETTINGS };

const settingsRepository: ISettingsRepository = {
  findByKey: async (key): Promise<Settings | null> => {
    if (settingsStore.key === key) {
      return { ...settingsStore };
    }
    return null;
  },

  upsert: async (key, data): Promise<Settings> => {
    settingsStore = {
      ...settingsStore,
      ...(data.hotelInfo && { hotelInfo: { ...settingsStore.hotelInfo, ...data.hotelInfo } }),
      ...(data.timeConfig && { timeConfig: { ...settingsStore.timeConfig, ...data.timeConfig } }),
      ...(data.taxConfig && { taxConfig: { ...settingsStore.taxConfig, ...data.taxConfig } }),
      ...(data.baseRoomPrices && { baseRoomPrices: { ...settingsStore.baseRoomPrices, ...data.baseRoomPrices } }),
      key,
      updatedAt: new Date(),
    };
    return { ...settingsStore };
  },
};

export default settingsRepository;
