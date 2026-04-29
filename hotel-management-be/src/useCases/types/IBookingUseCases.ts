import { type IUseCase } from "./IUseCase.js";
import { type Booking } from "../../models/Booking.js";

// Common Output
export type BookingUCOutput = Booking;

export type CreateBookingUCInput = {
  customerId?: string | undefined; 
  userId?: string | undefined; // Dùng cho Khách hàng tự đặt
  roomClass: string;
  startDate: Date;
  endDate: Date;
  guestCount: number;
  deposit?: number | undefined;
  details?: { code?: string; roomId: string }[] | undefined;
  executorUserId?: string | undefined;
};

// Input dành riêng cho Walk-in (khách đến trực tiếp, có thể chưa có tài khoản/hồ sơ)
export type CreateWalkInBookingUCInput = CreateBookingUCInput & {
  fullName?: string | undefined;     // HoTen
  identityCard?: string | undefined; // CMND
  phone?: string | undefined;        // SDT
  email?: string | undefined;        // Email
};

export type UpdateBookingUCInput = {
  id: string;
  roomClass?: string | undefined;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  guestCount?: number | undefined;
  deposit?: number | undefined;
  status?: string | undefined;
  details?: { code?: string; roomId: string }[] | undefined;
  executorUserId?: string | undefined;
};

export type CancelBookingUCInput = {
  id: string;
  executorUserId?: string | undefined;
};

// --- Staff UseCases ---
export type IStaffGetAllBookingsUseCase = IUseCase<void, BookingUCOutput[]>;
export type IStaffGetBookingByIdUseCase = IUseCase<{ id: string }, BookingUCOutput>;
export type IStaffCreateBookingUseCase = IUseCase<CreateBookingUCInput, BookingUCOutput>;
export type IStaffCreateWalkInBookingUseCase = IUseCase<CreateWalkInBookingUCInput, BookingUCOutput>;
export type IStaffUpdateBookingUseCase = IUseCase<UpdateBookingUCInput, BookingUCOutput>;
export type IStaffCancelBookingUseCase = IUseCase<CancelBookingUCInput, BookingUCOutput>;
export type IStaffDeleteBookingUseCase = IUseCase<{ id: string }, BookingUCOutput>;

// --- Customer UseCases ---
export type ICustomerGetMyBookingsUseCase = IUseCase<{ userId: string }, BookingUCOutput[]>;
export type ICustomerGetBookingByIdUseCase = IUseCase<{ id: string, userId: string }, BookingUCOutput>;
export type ICustomerCreateBookingUseCase = IUseCase<CreateBookingUCInput, BookingUCOutput>;
export type ICustomerUpdateBookingUseCase = IUseCase<UpdateBookingUCInput & { userId: string }, BookingUCOutput>;
export type ICustomerCancelBookingUseCase = IUseCase<CancelBookingUCInput & { userId: string }, BookingUCOutput>;
export type ICustomerDeleteBookingUseCase = IUseCase<{ id: string, userId: string }, BookingUCOutput>;
