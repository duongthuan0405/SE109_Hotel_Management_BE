import type { IGuestCreateMaintenanceRequestUseCase, GuestCreateMaintenanceUCInput, MaintenanceUCOutput } from "../../types/IMaintenanceUseCases.js";
import { maintenanceRepository, customerRepository } from "../../../repository/index.js";

const guestCreateMaintenanceRequestUseCase: IGuestCreateMaintenanceRequestUseCase = {
  execute: async (input: GuestCreateMaintenanceUCInput): Promise<MaintenanceUCOutput> => {
    // Ánh xạ userId → customerId
    const customer = await customerRepository.findByUserId(input.userId);
    if (!customer) {
      throw { status: 404, message: "Không tìm thấy thông tin khách hàng" };
    }

    // Tự sinh mã PBT
    const code = await maintenanceRepository.getNextCode();

    // Tạo yêu cầu bảo trì
    const record = await maintenanceRepository.create({
      code,
      roomId: input.roomId,
      customerId: customer.id,
      content: input.content,
      startDate: new Date(),
      endDate: new Date(),
      status: "Pending",
    });

    // Trả về record đã populated
    return maintenanceRepository.findById(record.id, { room: true, customer: true }) as Promise<MaintenanceUCOutput>;

    // TODO: Tạo notification khi module Notification (#2) hoàn tất
  },
};

export default guestCreateMaintenanceRequestUseCase;
