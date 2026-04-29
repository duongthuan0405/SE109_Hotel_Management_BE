import { type IUseCase } from "./IUseCase.js";
import { type Settings } from "../../models/Settings.js";

// Get Settings
export type IGetSettingsUseCase = IUseCase<{}, Settings>;

// Update Settings
export type UpdateSettingsUCInput = {
  hotelInfo?: Partial<Settings["hotelInfo"]> | undefined;
  timeConfig?: Partial<Settings["timeConfig"]> | undefined;
  taxConfig?: Partial<Settings["taxConfig"]> | undefined;
  baseRoomPrices?: Partial<Settings["baseRoomPrices"]> | undefined;
};
export type IUpdateSettingsUseCase = IUseCase<UpdateSettingsUCInput, Settings>;
