import { type IUseCase } from "./IUseCase.js";
import { type Booking } from "../../models/Booking.js";

export type CreateMomoSessionUCInput = {
  userId: string;
  roomClass: string;
  startDate: Date;
  endDate: Date;
  roomQuantity?: number | undefined;
  deposit?: number | undefined;
  details?: { roomId: string }[] | undefined;
  frontendUrl?: string | undefined;
};

export type CreateMomoSessionUCOutput = {
  payUrl: string;
  orderId: string;
  bookingId: string;
  message: string;
};

export type HandleMomoIPNUCInput = {
  body: Record<string, any>;
};

export type VerifyMomoRedirectUCInput = {
  query: Record<string, any>;
};

export type ICreateMomoSessionUseCase = IUseCase<CreateMomoSessionUCInput, CreateMomoSessionUCOutput>;
export type IHandleMomoIPNUseCase = IUseCase<HandleMomoIPNUCInput, void>;
export type IVerifyMomoRedirectUseCase = IUseCase<VerifyMomoRedirectUCInput, Booking>;
