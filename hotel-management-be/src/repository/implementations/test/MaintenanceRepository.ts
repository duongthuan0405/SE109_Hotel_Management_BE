import { type IMaintenanceRepository, type MaintenanceInclude } from "../../types/IMaintenanceRepository.js";
import { type Maintenance } from "../../../models/Maintenance.js";
import crypto from "crypto";
import roomRepository from "./RoomRepository.js";
import customerRepository from "./CustomerRepository.js";
import staffRepository from "./StaffRepository.js";

let maintenanceRecords: Maintenance[] = [
  {
    id: "maint-1",
    code: "PBT001",
    roomId: "room-1",
    customerId: undefined,
    technicianId: "staff-1",
    content: "Sửa điều hòa phòng 101",
    startDate: new Date("2026-05-01"),
    endDate: new Date("2026-05-02"),
    status: "Pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "maint-2",
    code: "PBT002",
    roomId: "room-2",
    customerId: undefined,
    technicianId: "staff-1",
    content: "Thay bóng đèn phòng 102",
    startDate: new Date("2026-04-28"),
    endDate: new Date("2026-04-28"),
    status: "Completed",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const applyInclude = async (record: Maintenance, include?: MaintenanceInclude): Promise<Maintenance> => {
  if (!include) return { ...record };

  const result = { ...record };

  if (include.room) {
    result.room = (await roomRepository.findById(record.roomId)) || undefined;
  }

  if (include.customer && record.customerId) {
    result.customer = (await customerRepository.findById(record.customerId)) || undefined;
  }

  if (include.technician && record.technicianId) {
    result.technician = (await staffRepository.findById(record.technicianId)) || undefined;
  }

  return result;
};

const maintenanceRepositoryImpl: IMaintenanceRepository = {
  findAll: async (include?: MaintenanceInclude): Promise<Maintenance[]> => {
    return Promise.all(maintenanceRecords.map((r) => applyInclude(r, include)));
  },

  findById: async (id: string, include?: MaintenanceInclude): Promise<Maintenance | null> => {
    const record = maintenanceRecords.find((r) => r.id === id);
    if (!record) return null;
    return applyInclude(record, include);
  },

  findByCustomerId: async (customerId: string, include?: MaintenanceInclude): Promise<Maintenance[]> => {
    const filtered = maintenanceRecords.filter((r) => r.customerId === customerId);
    return Promise.all(filtered.map((r) => applyInclude(r, include)));
  },

  create: async (data: Omit<Maintenance, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'room' | 'customer' | 'technician'>): Promise<Maintenance> => {
    let maxNum = 0;
    for (const record of maintenanceRecords) {
      const match = record.code.match(/PBT(\d+)/);
      if (match) {
        const num = parseInt(match[1]!, 10);
        if (num > maxNum) maxNum = num;
      }
    }
    const finalCode = `PBT${String(maxNum + 1).padStart(3, "0")}`;

    const newRecord: Maintenance = {
      ...data,
      id: crypto.randomUUID(),
      code: finalCode,
      roomId: data.roomId || "",
      customerId: data.customerId,
      technicianId: data.technicianId || "",
      content: data.content || "",
      startDate: data.startDate || new Date(),
      endDate: data.endDate || new Date(),
      status: data.status || "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    maintenanceRecords.push(newRecord);
    return { ...newRecord };
  },

  update: async (id: string, data: Partial<Maintenance>, include?: MaintenanceInclude): Promise<Maintenance | null> => {
    const index = maintenanceRecords.findIndex((r) => r.id === id);
    if (index === -1) return null;

    maintenanceRecords[index] = {
      ...maintenanceRecords[index],
      ...data,
      updatedAt: new Date(),
    } as Maintenance;
    return applyInclude(maintenanceRecords[index], include);
  },

  delete: async (id: string): Promise<boolean> => {
    const initialLength = maintenanceRecords.length;
    maintenanceRecords = maintenanceRecords.filter((r) => r.id !== id);
    return maintenanceRecords.length < initialLength;
  },

  getNextCode: async (): Promise<string> => {
    let maxNum = 0;
    for (const record of maintenanceRecords) {
      const match = record.code.match(/PBT(\d+)/);
      if (match) {
        const num = parseInt(match[1]!, 10);
        if (num > maxNum) maxNum = num;
      }
    }
    return `PBT${String(maxNum + 1).padStart(3, "0")}`;
  },
};

export default maintenanceRepositoryImpl;

