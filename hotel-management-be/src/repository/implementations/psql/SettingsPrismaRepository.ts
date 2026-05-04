import { type Settings } from "../../../models/Settings.js";
import { type ISettingsRepository } from "../../types/ISettingsRepository.js";
import prisma from "../../../config/prisma.js";

const mapToEntity = (s: any): Settings => {
  let parsedValue: any = {};
  try {
    parsedValue = typeof s.value === "string" ? JSON.parse(s.value) : s.value;
  } catch (e) {
    parsedValue = {};
  }

  return {
    id: s.id,
    key: s.key,
    hotelInfo: parsedValue.hotelInfo || {
      name: "Default Hotel",
      address: "",
      phone: "",
      email: "",
    },
    timeConfig: parsedValue.timeConfig || {
      checkInTime: "14:00",
      checkOutTime: "12:00",
    },
    taxConfig: parsedValue.taxConfig || {
      vatRate: 10,
      serviceFeeRate: 5,
    },
    baseRoomPrices: parsedValue.baseRoomPrices || {
      Normal: 0,
      Standard: 0,
      Premium: 0,
      Luxury: 0,
    },
  };
};

const settingsPrismaRepository: ISettingsRepository = {
  findByKey: async (key: string): Promise<Settings | null> => {
    const s = await prisma.settings.findUnique({
      where: { key },
    });
    return s ? mapToEntity(s) : null;
  },

  upsert: async (key: string, data: Partial<Omit<Settings, "id" | "key" | "createdAt" | "updatedAt">>): Promise<Settings> => {
    const existing = await prisma.settings.findUnique({ where: { key } });
    let existingValue: any = {};
    if (existing) {
      try {
        existingValue = JSON.parse(existing.value);
      } catch (e) {
        existingValue = {};
      }
    }

    const newValue = { ...existingValue, ...data };

    const s = await prisma.settings.upsert({
      where: { key },
      update: {
        value: JSON.stringify(newValue),
      },
      create: {
        key,
        value: JSON.stringify(newValue),
      },
    });
    return mapToEntity(s);
  },
};

export default settingsPrismaRepository;
