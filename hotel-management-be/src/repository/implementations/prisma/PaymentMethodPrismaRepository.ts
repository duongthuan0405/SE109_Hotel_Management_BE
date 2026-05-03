import { type PaymentMethod } from "../../../models/PaymentMethod.js";
import { type IPaymentMethodRepository } from "../../types/IPaymentMethodRepository.js";
import prisma from "../../../config/prisma.js";

const mapToEntity = (pm: any): PaymentMethod => ({
  id: pm.id,
  code: pm.code,
  name: pm.name,
});

const paymentMethodPrismaRepository: IPaymentMethodRepository = {
  create: async (data: Omit<PaymentMethod, "id" | "createdAt" | "updatedAt" | "code"> & { code?: string | undefined }): Promise<PaymentMethod> => {
    const code = data.code || (await paymentMethodPrismaRepository.generateNextCode());
    const newPm = await prisma.paymentMethod.create({
      data: {
        code: code,
        name: data.name,
      },
    });
    return mapToEntity(newPm);
  },

  findById: async (id: string): Promise<PaymentMethod | null> => {
    const pm = await prisma.paymentMethod.findUnique({
      where: { id },
    });
    return pm ? mapToEntity(pm) : null;
  },

  findByCode: async (code: string): Promise<PaymentMethod | null> => {
    const pm = await prisma.paymentMethod.findUnique({
      where: { code },
    });
    return pm ? mapToEntity(pm) : null;
  },

  findAll: async (): Promise<PaymentMethod[]> => {
    const pms = await prisma.paymentMethod.findMany();
    return pms.map(mapToEntity);
  },

  update: async (id: string, data: Partial<Omit<PaymentMethod, "id" | "createdAt" | "updatedAt">>): Promise<PaymentMethod | null> => {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.code !== undefined) updateData.code = data.code;

    const updated = await prisma.paymentMethod.update({
      where: { id },
      data: updateData,
    });
    return mapToEntity(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await prisma.paymentMethod.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },

  countAll: async (): Promise<number> => {
    return await prisma.paymentMethod.count();
  },

  generateNextCode: async (): Promise<string> => {
    const count = await prisma.paymentMethod.count();
    return `PM${(count + 1).toString().padStart(2, "0")}`;
  },
};

export default paymentMethodPrismaRepository;
