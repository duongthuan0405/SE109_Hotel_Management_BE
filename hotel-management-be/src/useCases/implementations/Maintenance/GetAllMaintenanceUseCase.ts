import type { IGetAllMaintenanceUseCase, MaintenanceUCOutput } from "../../types/IMaintenanceUseCases.js";
import { maintenanceRepository } from "../../../repository/index.js";

const getAllMaintenanceUseCase: IGetAllMaintenanceUseCase = {
  execute: async (): Promise<MaintenanceUCOutput[]> => {
    return maintenanceRepository.findAll({ room: true, customer: true, technician: true });
  },
};

export default getAllMaintenanceUseCase;
