import type { IDeleteMaintenanceUseCase } from "../../types/IMaintenanceUseCases.js";
import { maintenanceRepository } from "../../../repository/index.js";

const deleteMaintenanceUseCase: IDeleteMaintenanceUseCase = {
  execute: async (id: string): Promise<boolean> => {
    const record = await maintenanceRepository.findById(id);
    if (!record) {
      throw { status: 404, message: "Phiếu bảo trì không tồn tại" };
    }
    return maintenanceRepository.delete(id);
  },
};

export default deleteMaintenanceUseCase;
