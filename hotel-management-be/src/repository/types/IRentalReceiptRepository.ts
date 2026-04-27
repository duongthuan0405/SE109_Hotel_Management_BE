import { type RentalSlip } from "../../models/RentalSlip.js";

export interface IRentalReceiptRepository {
  create(data: Omit<RentalSlip, "id" | "createdAt" | "updatedAt">): Promise<RentalSlip>;
  findById(id: string): Promise<RentalSlip | null>;
  findBySlipCode(slipCode: string): Promise<RentalSlip | null>;
  findAll(): Promise<RentalSlip[]>;
  update(id: string, data: Partial<Omit<RentalSlip, "id" | "createdAt" | "updatedAt">>): Promise<RentalSlip | null>;
  delete(id: string): Promise<boolean>;
  countAll(): Promise<number>;
}
