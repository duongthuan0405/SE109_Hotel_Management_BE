import type { IGuestGetMaintenanceRequestsUseCase, MaintenanceUCOutput } from "../../types/IMaintenanceUseCases.js";
import { maintenanceRepository, customerRepository } from "../../../repository/index.js";

const guestGetMaintenanceRequestsUseCase: IGuestGetMaintenanceRequestsUseCase = {
  execute: async (userId: string): Promise<MaintenanceUCOutput[]> => {
    // Ánh xạ userId → customerId
    const customer = await customerRepository.findByUserId(userId);
    if (!customer) {
      throw { status: 404, message: "Không tìm thấy thông tin khách hàng" };
    }

    return maintenanceRepository.findByCustomerId(customer.id, { room: true });
  },
};

export default guestGetMaintenanceRequestsUseCase;
