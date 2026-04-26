import { type IUseCase } from "./IUseCase.js";
import { type Booking } from "../../models/Booking.js";

// Common Output
export type BookingUCOutput = Booking;

export type CreateBookingUCInput = {
  customerId?: string | undefined; 
  roomClass: string;
  startDate: Date;
  endDate: Date;
  guestCount: number;
  deposit?: number | undefined;
  details?: { code: string; roomId: string }[] | undefined;
};

export type UpdateBookingUCInput = {
  id: string;
  roomClass?: string | undefined;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  guestCount?: number | undefined;
  deposit?: number | undefined;
  status?: string | undefined;
  details?: { code: string; roomId: string }[] | undefined;
};

// --- Staff UseCases (No ownership check needed) ---
export type IStaffGetAllBookingsUseCase = IUseCase<void, BookingUCOutput[]>;
export type IStaffGetBookingByIdUseCase = IUseCase<{ id: string }, BookingUCOutput>;
export type IStaffCreateBookingUseCase = IUseCase<CreateBookingUCInput, BookingUCOutput>;
export type IStaffCreateWalkInBookingUseCase = IUseCase<CreateBookingUCInput, BookingUCOutput>;
export type IStaffUpdateBookingUseCase = IUseCase<UpdateBookingUCInput, BookingUCOutput>;
export type IStaffCancelBookingUseCase = IUseCase<{ id: string }, BookingUCOutput>;
export type IStaffDeleteBookingUseCase = IUseCase<{ id: string }, BookingUCOutput>;

// --- Customer UseCases (Must check ownership) ---
export type ICustomerGetMyBookingsUseCase = IUseCase<{ customerId: string }, BookingUCOutput[]>;
export type ICustomerGetBookingByIdUseCase = IUseCase<{ id: string, customerId: string }, BookingUCOutput>;
export type ICustomerCreateBookingUseCase = IUseCase<CreateBookingUCInput, BookingUCOutput>;
export type ICustomerUpdateBookingUseCase = IUseCase<UpdateBookingUCInput & { customerId: string }, BookingUCOutput>;
export type ICustomerCancelBookingUseCase = IUseCase<{ id: string, customerId: string }, BookingUCOutput>;
export type ICustomerDeleteBookingUseCase = IUseCase<{ id: string, customerId: string }, BookingUCOutput>;
