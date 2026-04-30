import type { IGuestCreateMaintenanceRequestUseCase, GuestCreateMaintenanceUCInput, MaintenanceUCOutput } from "../../types/IMaintenanceUseCases.js";
import { maintenanceRepository, customerRepository } from "../../../repository/index.js";
import { createNotificationUseCase } from "../../index.js";

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

    // Tạo thông báo cho khách hàng
    await createNotificationUseCase.execute({
      userId: input.userId,
      title: "Yêu cầu bảo trì đã gửi",
      content: `Yêu cầu bảo trì ${code} đã được gửi. Chúng tôi sẽ xử lý sớm nhất.`,
      type: "Maintenance",
    });

    // Trả về record đã populated
    return maintenanceRepository.findById(record.id, { room: true, customer: true }) as Promise<MaintenanceUCOutput>;
  },
};

export default guestCreateMaintenanceRequestUseCase;

