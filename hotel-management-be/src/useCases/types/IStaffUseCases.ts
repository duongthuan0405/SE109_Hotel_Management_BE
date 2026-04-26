import { type IUseCase } from "./IUseCase.js";
import { type Staff } from "../../models/Staff.js";

export type StaffUCOutput = Staff;

export type IGetAllStaffsUseCase = IUseCase<void, StaffUCOutput[]>;

export type GetStaffByIdUCInput = { id: string };
export type IGetStaffByIdUseCase = IUseCase<GetStaffByIdUCInput, StaffUCOutput>;

export type GetStaffByUserIdUCInput = { userId: string };
export type IGetStaffByUserIdUseCase = IUseCase<GetStaffByUserIdUCInput, StaffUCOutput>;

export type CreateStaffUCInput = {
  TaiKhoanId: string;
  HoTen: string;
  ChucVu: string;
  SDT: string;
  Email: string;
};
export type ICreateStaffUseCase = IUseCase<CreateStaffUCInput, StaffUCOutput>;

export type UpdateStaffUCInput = {
  id: string;
  HoTen?: string | undefined;
  ChucVu?: string | undefined;
  SDT?: string | undefined;
  Email?: string | undefined;
};
export type IUpdateStaffUseCase = IUseCase<UpdateStaffUCInput, StaffUCOutput>;

export type IDeleteStaffUseCase = IUseCase<{ id: string }, void>;
