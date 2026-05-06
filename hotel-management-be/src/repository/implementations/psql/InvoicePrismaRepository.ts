import { type Invoice } from "../../../models/Invoice.js";
import { type IInvoiceRepository, type InvoiceInclude } from "../../types/IInvoiceRepository.js";
import prisma from "../../../config/prisma.js";

const mapToEntity = (invoice: any): Invoice => ({
  id: invoice.id,
  code: invoice.code,
  rentalSlipId: invoice.rentalSlipId,
  cashierStaffId: invoice.cashierStaffId,
  customerId: invoice.customerId,
  invoiceDate: invoice.invoiceDate,
  roomTotal: invoice.roomTotal,
  serviceTotal: invoice.serviceTotal,
  surcharge: invoice.surcharge,
  damageCharge: invoice.damageCharge,
  deposit: invoice.deposit,
  grandTotal: invoice.grandTotal,
  paymentMethodId: invoice.paymentMethodId,
  paymentStatus: invoice.paymentStatus as Invoice["paymentStatus"],
  createdAt: invoice.createdAt,
  updatedAt: invoice.updatedAt,
  details: (invoice.details || []).map((d: any) => ({
    id: d.id,
    code: d.code,
    itemName: d.itemName,
    quantity: d.quantity,
    unitPrice: d.unitPrice,
    totalAmount: d.totalAmount,
  })),
  rentalSlip: invoice.rentalSlip ? {
    id: invoice.rentalSlip.id,
    code: invoice.rentalSlip.code,
    bookingId: invoice.rentalSlip.bookingId,
    roomId: invoice.rentalSlip.roomId,
    checkInDate: invoice.rentalSlip.checkInDate,
    expectedCheckOutDate: invoice.rentalSlip.expectedCheckOutDate,
    adjustedPrice: invoice.rentalSlip.adjustedPrice,
    checkInStaffId: invoice.rentalSlip.checkInStaffId,
    status: invoice.rentalSlip.status,
    createdAt: invoice.rentalSlip.createdAt,
    updatedAt: invoice.rentalSlip.updatedAt,
  } : undefined,
  cashierStaff: invoice.cashierStaff ? {
    id: invoice.cashierStaff.id,
    code: invoice.cashierStaff.code,
    fullName: invoice.cashierStaff.fullName,
    position: invoice.cashierStaff.position,
    phone: invoice.cashierStaff.phone,
    email: invoice.cashierStaff.email,
    userId: invoice.cashierStaff.userId,
    createdAt: invoice.cashierStaff.createdAt,
    updatedAt: invoice.cashierStaff.updatedAt,
  } : undefined,
  customer: invoice.customer ? {
    id: invoice.customer.id,
    code: invoice.customer.code,
    fullName: invoice.customer.fullName,
    identityCard: invoice.customer.identityCard,
    phone: invoice.customer.phone,
    email: invoice.customer.email || undefined,
    address: invoice.customer.address || undefined,
    userId: invoice.customer.userId || undefined,
    createdAt: invoice.customer.createdAt,
    updatedAt: invoice.customer.updatedAt,
  } : undefined,
  paymentMethod: invoice.paymentMethod ? {
    id: invoice.paymentMethod.id,
    code: invoice.paymentMethod.code,
    name: invoice.paymentMethod.name,
  } : undefined,
});

const invoicePrismaRepository: IInvoiceRepository = {
  create: async (data: Omit<Invoice, "id" | "createdAt" | "updatedAt" | "rentalSlip" | "cashierStaff" | "customer" | "paymentMethod" | "code" | "details"> & { code?: string | undefined; details: (Omit<any, "code"> & { code?: string | undefined })[]; }): Promise<Invoice> => {
    const code = data.code || (await invoicePrismaRepository.generateNextCode());
    const newInvoice = await prisma.invoice.create({
      data: {
        code,
        rentalSlipId: data.rentalSlipId,
        cashierStaffId: data.cashierStaffId,
        customerId: data.customerId,
        invoiceDate: data.invoiceDate,
        roomTotal: data.roomTotal,
        serviceTotal: data.serviceTotal,
        surcharge: data.surcharge,
        damageCharge: data.damageCharge,
        deposit: data.deposit,
        grandTotal: data.grandTotal,
        paymentMethodId: data.paymentMethodId,
        paymentStatus: data.paymentStatus,
        details: {
          create: data.details.map((d) => ({
            code: d.code || `CTHD${Date.now()}`,
            itemName: d.itemName,
            quantity: d.quantity,
            unitPrice: d.unitPrice,
            totalAmount: d.totalAmount,
          })),
        },
      },
      include: {
        rentalSlip: true,
        cashierStaff: true,
        customer: true,
        paymentMethod: true,
        details: true,
      },
    });
    return mapToEntity(newInvoice);
  },

  findById: async (id: string, include?: InvoiceInclude): Promise<Invoice | null> => {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        rentalSlip: include?.rentalSlip || false,
        cashierStaff: include?.cashierStaff || false,
        customer: include?.customer || false,
        paymentMethod: include?.paymentMethod || false,
        details: include?.details || false,
      },
    });
    return invoice ? mapToEntity(invoice) : null;
  },

  findByCode: async (code: string, include?: InvoiceInclude): Promise<Invoice | null> => {
    const invoice = await prisma.invoice.findUnique({
      where: { code },
      include: {
        rentalSlip: include?.rentalSlip || false,
        cashierStaff: include?.cashierStaff || false,
        customer: include?.customer || false,
        paymentMethod: include?.paymentMethod || false,
        details: include?.details || false,
      },
    });
    return invoice ? mapToEntity(invoice) : null;
  },

  findAll: async (include?: InvoiceInclude): Promise<Invoice[]> => {
    const invoices = await prisma.invoice.findMany({
      include: {
        rentalSlip: include?.rentalSlip || false,
        cashierStaff: include?.cashierStaff || false,
        customer: include?.customer || false,
        paymentMethod: include?.paymentMethod || false,
        details: include?.details || false,
      },
    });
    return invoices.map(mapToEntity);
  },

  findByCustomerId: async (customerId: string, include?: InvoiceInclude): Promise<Invoice[]> => {
    const invoices = await prisma.invoice.findMany({
      where: { customerId },
      include: {
        rentalSlip: include?.rentalSlip || false,
        cashierStaff: include?.cashierStaff || false,
        customer: include?.customer || false,
        paymentMethod: include?.paymentMethod || false,
        details: include?.details || false,
      },
    });
    return invoices.map(mapToEntity);
  },

  update: async (id: string, data: Partial<Omit<Invoice, "id" | "createdAt" | "updatedAt" | "rentalSlip" | "cashierStaff" | "customer" | "paymentMethod">>, include?: InvoiceInclude): Promise<Invoice | null> => {
    const updateData: any = {};
    if (data.rentalSlipId !== undefined) updateData.rentalSlipId = data.rentalSlipId;
    if (data.cashierStaffId !== undefined) updateData.cashierStaffId = data.cashierStaffId;
    if (data.customerId !== undefined) updateData.customerId = data.customerId;
    if (data.invoiceDate !== undefined) updateData.invoiceDate = data.invoiceDate;
    if (data.roomTotal !== undefined) updateData.roomTotal = data.roomTotal;
    if (data.serviceTotal !== undefined) updateData.serviceTotal = data.serviceTotal;
    if (data.surcharge !== undefined) updateData.surcharge = data.surcharge;
    if (data.damageCharge !== undefined) updateData.damageCharge = data.damageCharge;
    if (data.deposit !== undefined) updateData.deposit = data.deposit;
    if (data.grandTotal !== undefined) updateData.grandTotal = data.grandTotal;
    if (data.paymentMethodId !== undefined) updateData.paymentMethodId = data.paymentMethodId;
    if (data.paymentStatus !== undefined) updateData.paymentStatus = data.paymentStatus;

    const updated = await prisma.invoice.update({
      where: { id },
      data: updateData,
      include: {
        rentalSlip: include?.rentalSlip || false,
        cashierStaff: include?.cashierStaff || false,
        customer: include?.customer || false,
        paymentMethod: include?.paymentMethod || false,
        details: include?.details || false,
      },
    });
    return mapToEntity(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await prisma.invoiceDetail.deleteMany({ where: { invoiceId: id } });
      await prisma.invoice.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },

  countAll: async (): Promise<number> => {
    return await prisma.invoice.count();
  },

  generateNextCode: async (): Promise<string> => {
    const count = await prisma.invoice.count();
    return `HD${(count + 1).toString().padStart(4, "0")}`;
  },
};

export default invoicePrismaRepository;
