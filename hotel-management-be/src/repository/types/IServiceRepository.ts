import { type Service } from "../../models/Service.js";

export type IServiceRepository = {
  findAll(): Promise<Service[]>;
  findById(id: string): Promise<Service | null>;
  findByCode(code: string): Promise<Service | null>;
  create(service: Omit<Service, "id" | "code"> & { code?: string | undefined }): Promise<Service>;
  save(service: Service): Promise<Service>;
  update(id: string, service: Partial<Omit<Service, "id" | "createdAt" | "updatedAt">>): Promise<Service | null>;
  deleteById(id: string): Promise<boolean>;
  generateNextCode(): Promise<string>;
};
