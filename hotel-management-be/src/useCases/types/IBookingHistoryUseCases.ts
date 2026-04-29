import { type IUseCase } from "./IUseCase.js";
import { type BookingHistory, type BookingStatusValue } from "../../models/BookingHistory.js";

// Create
export type CreateBookingHistoryUCInput = {
  bookingId: string;
  oldStatus: BookingStatusValue;
  newStatus: BookingStatusValue;
  userId?: string | undefined;
};
export type ICreateBookingHistoryUseCase = IUseCase<CreateBookingHistoryUCInput, BookingHistory>;

// Get All
export type IGetAllBookingHistoryUseCase = IUseCase<{}, BookingHistory[]>;

// Get My (Customer)
export type GetMyBookingHistoryUCInput = { userId: string };
export type IGetMyBookingHistoryUseCase = IUseCase<GetMyBookingHistoryUCInput, BookingHistory[]>;

// Get By Id
export type GetBookingHistoryByIdUCInput = { id: string };
export type IGetBookingHistoryByIdUseCase = IUseCase<GetBookingHistoryByIdUCInput, BookingHistory>;

// Get By Booking Id
export type GetHistoryByBookingIdUCInput = { bookingId: string };
export type IGetHistoryByBookingIdUseCase = IUseCase<GetHistoryByBookingIdUCInput, BookingHistory[]>;

// Delete
export type DeleteBookingHistoryUCInput = { id: string };
export type IDeleteBookingHistoryUseCase = IUseCase<DeleteBookingHistoryUCInput, BookingHistory>;
