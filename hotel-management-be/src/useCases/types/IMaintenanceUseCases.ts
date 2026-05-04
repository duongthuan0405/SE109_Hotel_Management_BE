import type { Maintenance, MaintenanceStatus } from "../../models/Maintenance.js";
import type { IUseCase } from "./IUseCase.js";

// UCOutput chung — ánh xạ từ Maintenance model
export type MaintenanceUCOutput = Maintenance;

// --- Staff UseCases ---

export type IGetAllMaintenanceUseCase = IUseCase<void, MaintenanceUCOutput[]>;

export type IGetMaintenanceByIdUseCase = IUseCase<string, MaintenanceUCOutput | null>;

export type IGetNextMaintenanceCodeUseCase = IUseCase<void, string>;

export type CreateMaintenanceUCInput = {
  roomId: string;
  technicianId: string;
  content: string;
  startDate: string;
  endDate: string;
};
export type ICreateMaintenanceUseCase = IUseCase<CreateMaintenanceUCInput, MaintenanceUCOutput>;

export type UpdateMaintenanceUCInput = {
  id: string;
  content?: string | undefined;
  technicianId?: string | undefined;
  startDate?: string | undefined;
  endDate?: string | undefined;
  status?: MaintenanceStatus | undefined;
};
export type IUpdateMaintenanceUseCase = IUseCase<UpdateMaintenanceUCInput, MaintenanceUCOutput | null>;

export type IDeleteMaintenanceUseCase = IUseCase<string, boolean>;

// --- Guest UseCases ---

// Input là userId (lấy từ token), UseCase sẽ ánh xạ sang customerId
export type IGuestGetMaintenanceRequestsUseCase = IUseCase<string, MaintenanceUCOutput[]>;

export type GuestCreateMaintenanceUCInput = {
  userId: string;    // Lấy từ token, UseCase ánh xạ sang customerId
  roomId: string;
  content: string;
};
export type IGuestCreateMaintenanceRequestUseCase = IUseCase<GuestCreateMaintenanceUCInput, MaintenanceUCOutput>;
