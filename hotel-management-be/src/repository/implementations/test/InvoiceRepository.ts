import { type IInvoiceRepository, type InvoiceInclude } from "../../types/IInvoiceRepository.js";
import { type Invoice, type InvoiceDetail } from "../../../models/Invoice.js";
import crypto from "crypto";
import rentalReceiptRepository from "./RentalReceiptRepository.js";
import staffRepository from "./StaffRepository.js";
import customerRepository from "./CustomerRepository.js";
import paymentMethodRepository from "./PaymentMethodRepository.js";

let invoices: Invoice[] = [];

const applyInclude = async (invoice: Invoice, include?: InvoiceInclude): Promise<Invoice> => {
  if (!include) return { ...invoice };

  const result = { ...invoice };

  if (include.rentalSlip) {
    result.rentalSlip = (await rentalReceiptRepository.findById(invoice.rentalSlipId)) || undefined;
  }
  if (include.cashierStaff) {
    result.cashierStaff = (await staffRepository.findById(invoice.cashierStaffId)) || undefined;
  }
  if (include.customer) {
    result.customer = (await customerRepository.findById(invoice.customerId)) || undefined;
  }
  if (include.paymentMethod) {
    result.paymentMethod = (await paymentMethodRepository.findById(invoice.paymentMethodId)) || undefined;
  }

  return result;
};

const invoiceRepository: IInvoiceRepository = {
  create: async (data: Omit<Invoice, "id" | "createdAt" | "updatedAt" | "rentalSlip" | "cashierStaff" | "customer" | "paymentMethod" | "code" | "details"> & { 
    code?: string | undefined;
    details: (Omit<InvoiceDetail, "code"> & { code?: string | undefined })[];
  }): Promise<Invoice> => {
    const code = data.code || (await invoiceRepository.generateNextCode());
    const newInvoice: Invoice = {
      id: crypto.randomUUID(),
      ...data,
      code,
      details: data.details.map((d, index) => ({
        ...d,
        code: d.code || `CTHD-${Date.now()}-${index}`,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    invoices.push(newInvoice);
    return { ...newInvoice };
  },

  findById: async (id: string, include?: InvoiceInclude): Promise<Invoice | null> => {
    const invoice = invoices.find((inv) => inv.id === id);
    if (!invoice) return null;
    return applyInclude(invoice, include);
  },

  findByCode: async (code: string, include?: InvoiceInclude): Promise<Invoice | null> => {
    const invoice = invoices.find((inv) => inv.code === code);
    if (!invoice) return null;
    return applyInclude(invoice, include);
  },

  findAll: async (include?: InvoiceInclude): Promise<Invoice[]> => {
    return Promise.all(invoices.map((inv) => applyInclude(inv, include)));
  },

  findByCustomerId: async (customerId: string, include?: InvoiceInclude): Promise<Invoice[]> => {
    const filtered = invoices.filter((inv) => inv.customerId === customerId);
    return Promise.all(filtered.map((inv) => applyInclude(inv, include)));
  },

  update: async (id: string, data: Partial<Invoice>, include?: InvoiceInclude): Promise<Invoice | null> => {
    const index = invoices.findIndex((inv) => inv.id === id);
    if (index === -1) return null;

    const updated = {
      ...invoices[index]!,
      ...data,
      updatedAt: new Date(),
    } as Invoice;

    invoices[index] = updated;
    return applyInclude(updated, include);
  },

  delete: async (id: string): Promise<boolean> => {
    const initialLength = invoices.length;
    invoices = invoices.filter((inv) => inv.id !== id);
    return invoices.length < initialLength;
  },

  countAll: async (): Promise<number> => {
    return invoices.length;
  },
  generateNextCode: async (): Promise<string> => {
    const nextId = invoices.length + 1;
    return `HD${String(nextId).padStart(3, "0")}`;
  },
};


export default invoiceRepository;
