import { type Settings } from "../../models/Settings.js";

export interface ISettingsRepository {
  findByKey(key: string): Promise<Settings | null>;
  upsert(key: string, data: Partial<Omit<Settings, "id" | "key" | "createdAt" | "updatedAt">>): Promise<Settings>;
}
