import { type IServiceRepository } from "../types/IServiceRepository.js";
import { type Service } from "../../models/Service.js";

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
  create: async (service: Omit<Service, "id">): Promise<Service> => {
    const newService: Service = {
      ...service,
      id: `service-${mockServices.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockServices.push(newService);
    return newService;
  },
  save: async (service: Service): Promise<Service> => {
    const index = mockServices.findIndex((s) => s.id === service.id);
    if (index !== -1) {
      mockServices[index] = { ...service, updatedAt: new Date() };
    }
    return service;
  },
  deleteById: async (id: string): Promise<boolean> => {
    const index = mockServices.findIndex((s) => s.id === id);
    if (index !== -1) {
      mockServices.splice(index, 1);
      return true;
    }
    return false;
  },
};

export default serviceRepository;
