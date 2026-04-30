import type { ICreateMaintenanceUseCase, CreateMaintenanceUCInput, MaintenanceUCOutput } from "../../types/IMaintenanceUseCases.js";
import { maintenanceRepository, bookingRepository, roomRepository } from "../../../repository/index.js";

const createMaintenanceUseCase: ICreateMaintenanceUseCase = {
  execute: async (input: CreateMaintenanceUCInput): Promise<MaintenanceUCOutput> => {
    // Validate: kiểm tra phòng có đang có khách CheckedIn không
    const allBookings = await bookingRepository.findAll();
    const activeBooking = allBookings.find((booking) => {
      const hasRoom = booking.details?.some((d) => d.roomId === input.roomId);
      return hasRoom && booking.status === "CheckedIn";
    });

    if (activeBooking) {
      const bookingEndDate = new Date(activeBooking.endDate);
      const maintenanceStartDate = new Date(input.startDate);

      // Reset hours to compare dates only
      bookingEndDate.setHours(0, 0, 0, 0);
      maintenanceStartDate.setHours(0, 0, 0, 0);

      if (maintenanceStartDate < bookingEndDate) {
        throw {
          status: 400,
          message: `Phòng đang có khách. Ngày bảo trì phải từ ngày ${activeBooking.endDate.toISOString().split("T")[0]} trở đi.`,
        };
      }
    }

    // Tạo phiếu bảo trì
    const record = await maintenanceRepository.create({
      code: input.code,
      roomId: input.roomId,
      technicianId: input.technicianId,
      content: input.content,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      status: "Pending",
    });

    // Cập nhật trạng thái phòng thành Maintenance
    await roomRepository.updateStatus(input.roomId, "Maintenance");

    // Trả về record đã populated
    return maintenanceRepository.findById(record.id, { room: true, customer: true, technician: true }) as Promise<MaintenanceUCOutput>;
  },
};

export default createMaintenanceUseCase;
