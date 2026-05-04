import { type Customer } from "../../../models/Customer.js";
import { type ICustomerRepository, type CustomerInclude } from "../../types/ICustomerRepository.js";
import prisma from "../../../config/prisma.js";

const mapToEntity = (customer: any): Customer => ({
  id: customer.id,
  code: customer.code,
  fullName: customer.fullName,
  identityCard: customer.identityCard,
  phone: customer.phone,
  email: customer.email || undefined,
  address: customer.address || undefined,
  userId: customer.userId || undefined,
  createdAt: customer.createdAt,
  updatedAt: customer.updatedAt,
  user: customer.user ? {
    id: customer.user.id,
    username: customer.user.username,
    passwordHash: customer.user.passwordHash,
    role: customer.user.role,
  } : undefined,
});

const customerPrismaRepository: ICustomerRepository = {
  findAll: async (include?: CustomerInclude): Promise<Customer[]> => {
    const customers = await prisma.customer.findMany({
      include: {
        user: include?.user || false,
      },
    });
    return customers.map(mapToEntity);
  },

  findById: async (id: string, include?: CustomerInclude): Promise<Customer | null> => {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        user: include?.user || false,
      },
    });
    return customer ? mapToEntity(customer) : null;
  },

  findByUserId: async (userId: string, include?: CustomerInclude): Promise<Customer | null> => {
    const customer = await prisma.customer.findUnique({
      where: { userId },
      include: {
        user: include?.user || false,
      },
    });
    return customer ? mapToEntity(customer) : null;
  },

  findByCode: async (code: string, include?: CustomerInclude): Promise<Customer | null> => {
    const customer = await prisma.customer.findUnique({
      where: { code },
      include: {
        user: include?.user || false,
      },
    });
    return customer ? mapToEntity(customer) : null;
  },

  findByIdentityCard: async (identityCard: string, include?: CustomerInclude): Promise<Customer | null> => {
    const customer = await prisma.customer.findUnique({
      where: { identityCard },
      include: {
        user: include?.user || false,
      },
    });
    return customer ? mapToEntity(customer) : null;
  },

  findByEmail: async (email: string, include?: CustomerInclude): Promise<Customer | null> => {
    const customer = await prisma.customer.findFirst({
      where: { email },
      include: {
        user: include?.user || false,
      },
    });
    return customer ? mapToEntity(customer) : null;
  },

  create: async (customer: Omit<Customer, "id" | "createdAt" | "updatedAt" | "user" | "code"> & { code?: string | undefined }): Promise<Customer> => {
    const code = customer.code || (await customerPrismaRepository.generateNextCode());
    const newCustomer = await prisma.customer.create({
      data: {
        code,
        fullName: customer.fullName,
        identityCard: customer.identityCard,
        phone: customer.phone,
        email: customer.email || null,
        address: customer.address || null,
        userId: customer.userId || null,
      },
    });
    return mapToEntity(newCustomer);
  },

  update: async (id: string, data: Partial<Omit<Customer, "user">>, include?: CustomerInclude): Promise<Customer | null> => {
    const updateData: any = {};
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.identityCard !== undefined) updateData.identityCard = data.identityCard;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.userId !== undefined) updateData.userId = data.userId;

    const updated = await prisma.customer.update({
      where: { id },
      data: updateData,
      include: {
        user: include?.user || false,
      },
    });
    return mapToEntity(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await prisma.customer.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },

  generateNextCode: async (): Promise<string> => {
    const count = await prisma.customer.count();
    return `KH${(count + 1).toString().padStart(3, "0")}`;
  },
};

export default customerPrismaRepository;
