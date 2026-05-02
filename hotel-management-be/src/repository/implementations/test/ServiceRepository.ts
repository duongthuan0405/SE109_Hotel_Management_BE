import { type IServiceRepository } from "../../types/IServiceRepository.js";
import { type Service } from "../../../models/Service.js";
import crypto from "crypto";

const mockServices: Service[] = [
  {
    id: "service-1",
    code: "DV001",
    name: "Giặt ủi",
    price: 50000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "service-2",
    code: "DV002",
    name: "Coca Cola",
    price: 20000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const serviceRepository: IServiceRepository = {
  findAll: async (): Promise<Service[]> => {
    return mockServices;
  },
  findById: async (id: string): Promise<Service | null> => {
    return mockServices.find((s) => s.id === id) || null;
  },
  findByCode: async (code: string): Promise<Service | null> => {
    return mockServices.find((s) => s.code === code) || null;
  },
  create: async (service: Omit<Service, "id" | "code"> & { code?: string | undefined }): Promise<Service> => {
    const code = service.code || (await serviceRepository.generateNextCode());
    const newService: Service = {
      ...service,
      code,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockServices.push(newService);
    return newService;
  },
  save: async (service: Service): Promise<Service> => {
    const index = mockServices.findIndex((s) => s.id === service.id);
    if (index !== -1) {
      mockServices[index] = { ...service, updatedAt: new Date() } as Service;
    }
    return service;
  },
  update: async (id: string, service: Partial<Omit<Service, "id" | "createdAt" | "updatedAt">>): Promise<Service | null> => {
    const index = mockServices.findIndex((s) => s.id === id);
    if (index === -1) return null;
    mockServices[index] = { ...mockServices[index], ...service, updatedAt: new Date() } as Service;
    return mockServices[index];
  },
  deleteById: async (id: string): Promise<boolean> => {
    const index = mockServices.findIndex((s) => s.id === id);
    if (index !== -1) {
      mockServices.splice(index, 1);
      return true;
    }
    return false;
  },
  generateNextCode: async (): Promise<string> => {
    const nextId = mockServices.length + 1;
    return `DV${String(nextId).padStart(3, "0")}`;
  },
};

export default serviceRepository;
