import { type IPaymentMethodRepository } from "../../types/IPaymentMethodRepository.js";
import { type PaymentMethod } from "../../../models/PaymentMethod.js";
import crypto from "crypto";

let paymentMethods: PaymentMethod[] = [
  {
    id: "pm-1",
    code: "TM",
    name: "Tiền mặt",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "pm-2",
    code: "CK",
    name: "Chuyển khoản",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "pm-3",
    code: "THE",
    name: "Thẻ tín dụng",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const paymentMethodRepository: IPaymentMethodRepository = {
  create: async (data: Omit<PaymentMethod, "id" | "createdAt" | "updatedAt" | "code"> & { code?: string | undefined }): Promise<PaymentMethod> => {
    const code = data.code || (await paymentMethodRepository.generateNextCode());
    const newMethod: PaymentMethod = {
      id: crypto.randomUUID(),
      ...data,
      code,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    paymentMethods.push(newMethod);
    return { ...newMethod };
  },

  findById: async (id): Promise<PaymentMethod | null> => {
    const method = paymentMethods.find((pm) => pm.id === id);
    return method ? { ...method } : null;
  },

  findByCode: async (code): Promise<PaymentMethod | null> => {
    const method = paymentMethods.find((pm) => pm.code === code);
    return method ? { ...method } : null;
  },

  findAll: async (): Promise<PaymentMethod[]> => {
    return paymentMethods.map((pm) => ({ ...pm }));
  },

  update: async (id, data): Promise<PaymentMethod | null> => {
    const index = paymentMethods.findIndex((pm) => pm.id === id);
    if (index === -1) return null;

    const updated = {
      ...paymentMethods[index]!,
      ...data,
      updatedAt: new Date(),
    };
    paymentMethods[index] = updated;
    return { ...updated };
  },

  delete: async (id): Promise<boolean> => {
    const initialLength = paymentMethods.length;
    paymentMethods = paymentMethods.filter((pm) => pm.id !== id);
    return paymentMethods.length < initialLength;
  },

  countAll: async (): Promise<number> => {
    return paymentMethods.length;
  },
  generateNextCode: async (): Promise<string> => {
    const nextId = paymentMethods.length + 1;
    return `PTTT${String(nextId).padStart(3, "0")}`;
  },
};

export default paymentMethodRepository;
