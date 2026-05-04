import type { IGetNextMaintenanceCodeUseCase } from "../../types/IMaintenanceUseCases.js";
import { maintenanceRepository } from "../../../repository/index.js";

const getNextMaintenanceCodeUseCase: IGetNextMaintenanceCodeUseCase = {
  execute: async (): Promise<string> => {
    return maintenanceRepository.getNextCode();
  },
};

export default getNextMaintenanceCodeUseCase;
