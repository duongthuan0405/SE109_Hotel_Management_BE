import { type IUseCase } from "./IUseCase.js";
import { type Staff } from "../../models/Staff.js";

export type StaffUCOutput = Staff;

export type IGetAllStaffsUseCase = IUseCase<void, StaffUCOutput[]>;

export type GetStaffByIdUCInput = { id: string };
export type IGetStaffByIdUseCase = IUseCase<GetStaffByIdUCInput, StaffUCOutput>;

export type GetStaffByUserIdUCInput = { userId: string };
export type IGetStaffByUserIdUseCase = IUseCase<GetStaffByUserIdUCInput, StaffUCOutput>;

export type CreateStaffUCInput = {
  userId: string;
  fullName: string;
  position: string;
  phone: string;
  email: string;
};
export type ICreateStaffUseCase = IUseCase<CreateStaffUCInput, StaffUCOutput>;

export type UpdateStaffUCInput = {
  id: string;
  fullName?: string | undefined;
  position?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
};
export type IUpdateStaffUseCase = IUseCase<UpdateStaffUCInput, StaffUCOutput>;

export type IDeleteStaffUseCase = IUseCase<{ id: string }, void>;
