import { type RentalSlip } from "../../models/RentalSlip.js";

export type RentalReceiptInclude = {
  booking?: boolean;
  room?: boolean;
  checkInStaff?: boolean;
};

export interface IRentalReceiptRepository {
  create(data: Omit<RentalSlip, "id" | "createdAt" | "updatedAt" | "booking" | "room" | "checkInStaff">): Promise<RentalSlip>;
  findById(id: string, include?: RentalReceiptInclude): Promise<RentalSlip | null>;
  findByCode(code: string, include?: RentalReceiptInclude): Promise<RentalSlip | null>;
  findAll(include?: RentalReceiptInclude): Promise<RentalSlip[]>;
  update(id: string, data: Partial<Omit<RentalSlip, "id" | "createdAt" | "updatedAt" | "booking" | "room" | "checkInStaff">>, include?: RentalReceiptInclude): Promise<RentalSlip | null>;
  delete(id: string): Promise<boolean>;
  countAll(): Promise<number>;
}
