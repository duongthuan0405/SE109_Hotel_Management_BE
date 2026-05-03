import type { IUpdateMaintenanceUseCase, UpdateMaintenanceUCInput, MaintenanceUCOutput } from "../../types/IMaintenanceUseCases.js";
import { maintenanceRepository, roomRepository } from "../../../repository/index.js";

const updateMaintenanceUseCase: IUpdateMaintenanceUseCase = {
  execute: async (input: UpdateMaintenanceUCInput): Promise<MaintenanceUCOutput | null> => {
    const existing = await maintenanceRepository.findById(input.id);
    if (!existing) {
      throw { status: 404, message: "Phiếu bảo trì không tồn tại" };
    }

    const updateData: Record<string, any> = {};
    if (input.content !== undefined) updateData.content = input.content;
    if (input.technicianId !== undefined) updateData.technicianId = input.technicianId;
    if (input.startDate !== undefined) updateData.startDate = new Date(input.startDate);
    if (input.endDate !== undefined) updateData.endDate = new Date(input.endDate);
    if (input.status !== undefined) updateData.status = input.status;

    const updated = await maintenanceRepository.update(input.id, updateData, { room: true, customer: true, technician: true });

    // Nếu trạng thái thành Completed → cập nhật trạng thái phòng thành Available
    if (input.status === "Completed" && updated) {
      await roomRepository.updateStatus(existing.roomId, "Available");
    }

    return updated;
  },
};

export default updateMaintenanceUseCase;
