import type { IGetMaintenanceByIdUseCase, MaintenanceUCOutput } from "../../types/IMaintenanceUseCases.js";
import { maintenanceRepository } from "../../../repository/index.js";

const getMaintenanceByIdUseCase: IGetMaintenanceByIdUseCase = {
  execute: async (id: string): Promise<MaintenanceUCOutput | null> => {
    return maintenanceRepository.findById(id, { room: true, customer: true, technician: true });
  },
};

export default getMaintenanceByIdUseCase;
