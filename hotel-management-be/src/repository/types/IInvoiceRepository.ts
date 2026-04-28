import { type Invoice } from "../../models/Invoice.js";

export type InvoiceInclude = {
  rentalSlip?: boolean;
  cashierStaff?: boolean;
  customer?: boolean;
  paymentMethod?: boolean;
};

export interface IInvoiceRepository {
  create(data: Omit<Invoice, "id" | "createdAt" | "updatedAt" | "rentalSlip" | "cashierStaff" | "customer" | "paymentMethod">): Promise<Invoice>;
  findById(id: string, include?: InvoiceInclude): Promise<Invoice | null>;
  findByCode(code: string, include?: InvoiceInclude): Promise<Invoice | null>;
  findAll(include?: InvoiceInclude): Promise<Invoice[]>;
  update(id: string, data: Partial<Omit<Invoice, "id" | "createdAt" | "updatedAt" | "rentalSlip" | "cashierStaff" | "customer" | "paymentMethod">>, include?: InvoiceInclude): Promise<Invoice | null>;
  delete(id: string): Promise<boolean>;
  countAll(): Promise<number>;
}
