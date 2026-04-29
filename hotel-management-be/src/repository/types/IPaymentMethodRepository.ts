import { type PaymentMethod } from "../../models/PaymentMethod.js";

export interface IPaymentMethodRepository {
  create(data: Omit<PaymentMethod, "id" | "createdAt" | "updatedAt" | "code"> & { code?: string | undefined }): Promise<PaymentMethod>;
  findById(id: string): Promise<PaymentMethod | null>;
  findByCode(code: string): Promise<PaymentMethod | null>;
  findAll(): Promise<PaymentMethod[]>;
  update(id: string, data: Partial<Omit<PaymentMethod, "id" | "createdAt" | "updatedAt">>): Promise<PaymentMethod | null>;
  delete(id: string): Promise<boolean>;
  countAll(): Promise<number>;
  generateNextCode(): Promise<string>;
}
