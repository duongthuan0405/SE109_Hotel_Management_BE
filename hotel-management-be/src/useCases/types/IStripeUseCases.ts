import { type IUseCase } from "./IUseCase.js";
import { type Booking } from "../../models/Booking.js";

export type CreateStripeSessionUCInput = {
  userId: string;
  roomClass: string;
  startDate: Date;
  endDate: Date;
  roomQuantity?: number | undefined;
  deposit?: number | undefined;
  details?: { roomId: string }[] | undefined;
  frontendUrl?: string | undefined;
};

export type CreateStripeSessionUCOutput = {
  sessionId: string;
  url: string | null;
  bookingId: string;
};

export type VerifyStripePaymentUCInput = {
  sessionId: string;
  bookingId: string;
};

export type CancelPendingBookingUCInput = {
  bookingId: string;
  userId?: string | undefined; // Option to enforce authorization checks
};

export type ICreateStripeSessionUseCase = IUseCase<CreateStripeSessionUCInput, CreateStripeSessionUCOutput>;
export type IVerifyStripePaymentUseCase = IUseCase<VerifyStripePaymentUCInput, Booking>;
export type ICancelPendingBookingUseCase = IUseCase<CancelPendingBookingUCInput, Booking>;
