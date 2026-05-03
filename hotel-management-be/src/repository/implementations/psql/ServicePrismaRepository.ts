import { type Service } from "../../../models/Service.js";
import { type IServiceRepository } from "../../types/IServiceRepository.js";
import prisma from "../../../config/prisma.js";

const mapToEntity = (service: any): Service => ({
  id: service.id,
  code: service.code,
  name: service.name,
  price: service.price,
});

const servicePrismaRepository: IServiceRepository = {
  findAll: async (): Promise<Service[]> => {
    const services = await prisma.service.findMany();
    return services.map(mapToEntity);
  },

  findById: async (id: string): Promise<Service | null> => {
    const service = await prisma.service.findUnique({
      where: { id },
    });
    return service ? mapToEntity(service) : null;
  },

  findByCode: async (code: string): Promise<Service | null> => {
    const service = await prisma.service.findUnique({
      where: { code },
    });
    return service ? mapToEntity(service) : null;
  },

  create: async (service: Omit<Service, "id" | "code"> & { code?: string | undefined }): Promise<Service> => {
    const code = service.code || (await servicePrismaRepository.generateNextCode());
    const newService = await prisma.service.create({
      data: {
        code,
        name: service.name,
        price: service.price,
      },
    });
    return mapToEntity(newService);
  },

  save: async (service: Service): Promise<Service> => {
    const saved = await prisma.service.upsert({
      where: { id: service.id },
      update: {
        name: service.name,
        price: service.price,
      },
      create: {
        id: service.id,
        code: service.code,
        name: service.name,
        price: service.price,
      },
    });
    return mapToEntity(saved);
  },

  update: async (id: string, service: Partial<Omit<Service, "id" | "createdAt" | "updatedAt">>): Promise<Service | null> => {
    const updateData: any = {};
    if (service.name !== undefined) updateData.name = service.name;
    if (service.price !== undefined) updateData.price = service.price;
    if (service.code !== undefined) updateData.code = service.code;

    const updated = await prisma.service.update({
      where: { id },
      data: updateData,
    });
    return mapToEntity(updated);
  },

  deleteById: async (id: string): Promise<boolean> => {
    try {
      await prisma.service.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },

  generateNextCode: async (): Promise<string> => {
    const count = await prisma.service.count();
    return `DV${(count + 1).toString().padStart(3, "0")}`;
  },
};

export default servicePrismaRepository;
