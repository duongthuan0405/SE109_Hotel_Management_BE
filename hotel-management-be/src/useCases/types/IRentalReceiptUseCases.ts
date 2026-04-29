import { type IUseCase } from "./IUseCase.js";
import { type RentalSlip, type RentalSlipStatus } from "../../models/RentalSlip.js";

// Create
export type CreateRentalReceiptUCInput = {
  bookingId: string;
  roomId: string;
  expectedCheckOutDate: Date;
  actualGuestCount: number;
  adjustedPrice: number;
  checkInStaffUserId: string;
  executorUserId?: string;
};
export type ICreateRentalReceiptUseCase = IUseCase<CreateRentalReceiptUCInput, RentalSlip>;

// Get All
export type IGetAllRentalReceiptsUseCase = IUseCase<{}, RentalSlip[]>;

// Get By ID
export type GetRentalReceiptByIdUCInput = { id: string };
export type IGetRentalReceiptByIdUseCase = IUseCase<GetRentalReceiptByIdUCInput, RentalSlip>;

// Update
export type UpdateRentalReceiptUCInput = {
  id: string;
  expectedCheckOutDate?: Date | undefined;
  actualGuestCount?: number | undefined;
  adjustedPrice?: number | undefined;
  status?: RentalSlipStatus | undefined;
};
export type IUpdateRentalReceiptUseCase = IUseCase<UpdateRentalReceiptUCInput, RentalSlip>;

// Check-out
export type CheckOutUCInput = { id: string; executorUserId?: string };
export type ICheckOutUseCase = IUseCase<CheckOutUCInput, RentalSlip>;

// Delete
export type DeleteRentalReceiptUCInput = { id: string };
export type IDeleteRentalReceiptUseCase = IUseCase<DeleteRentalReceiptUCInput, RentalSlip>;
