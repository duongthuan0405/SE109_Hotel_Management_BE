import type { Maintenance } from "../../models/Maintenance.js";

export type MaintenanceInclude = {
  room?: boolean;
  customer?: boolean;
  technician?: boolean;
};

export interface IMaintenanceRepository {
  findAll(include?: MaintenanceInclude): Promise<Maintenance[]>;
  findById(id: string, include?: MaintenanceInclude): Promise<Maintenance | null>;
  findByCustomerId(customerId: string, include?: MaintenanceInclude): Promise<Maintenance[]>;
  create(data: Omit<Maintenance, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'room' | 'customer' | 'technician'>): Promise<Maintenance>;
  update(id: string, data: Partial<Omit<Maintenance, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'room' | 'customer' | 'technician'>>, include?: MaintenanceInclude): Promise<Maintenance | null>;
  delete(id: string): Promise<boolean>;
  getNextCode(): Promise<string>;
}
