import { type Customer } from "../../../models/Customer.js";
import { type ICustomerRepository, type CustomerInclude } from "../../types/ICustomerRepository.js";
import userRepository, { SEED_USER_ID_CUSTOMER } from "./UserRepository.js";
import crypto from "crypto";

const mockCustomers: Customer[] = [
  {
    id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
    code: "KH001",
    fullName: "Customer One",
    identityCard: "123456789",
    phone: "0123456789",
    email: "customer1@test.com",
    userId: SEED_USER_ID_CUSTOMER,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const applyInclude = async (customer: Customer, include?: CustomerInclude): Promise<Customer> => {
  if (!include) return { ...customer };
  const result = { ...customer };
  if (include.user && customer.userId) {
    result.user = (await userRepository.findById(customer.userId)) || undefined;
  }
  return result;
};

const customerRepository: ICustomerRepository = {
  findAll: async (include): Promise<Customer[]> => {
    return Promise.all(mockCustomers.map((c) => applyInclude(c, include)));
  },
  findById: async (id: string, include?: CustomerInclude): Promise<Customer | null> => {
    const customer = mockCustomers.find((c) => c.id === id);
    if (!customer) return null;
    return applyInclude(customer, include);
  },
  findByUserId: async (userId: string, include?: CustomerInclude): Promise<Customer | null> => {
    const customer = mockCustomers.find((c) => c.userId === userId);
    if (!customer) return null;
    return applyInclude(customer, include);
  },
  findByCode: async (code: string, include?: CustomerInclude): Promise<Customer | null> => {
    const customer = mockCustomers.find((c) => c.code === code);
    if (!customer) return null;
    return applyInclude(customer, include);
  },
  findByEmail: async (email: string, include?: CustomerInclude): Promise<Customer | null> => {
    const customer = mockCustomers.find((c) => c.email === email);
    if (!customer) return null;
    return applyInclude(customer, include);
  },
  findByIdentityCard: async (identityCard: string, include?: CustomerInclude): Promise<Customer | null> => {
    const customer = mockCustomers.find((c) => c.identityCard === identityCard);
    if (!customer) return null;
    return applyInclude(customer, include);
  },
  create: async (customer: Omit<Customer, "id" | "createdAt" | "updatedAt" | "user" | "code"> & { code?: string | undefined }): Promise<Customer> => {
    const code = customer.code || (await customerRepository.generateNextCode());
    const newCustomer: Customer = {
      ...customer,
      code,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCustomers.push(newCustomer);
    return newCustomer;
  },
  update: async (id, data, include): Promise<Customer | null> => {
    const index = mockCustomers.findIndex((c) => c.id === id);
    if (index === -1) return null;
    mockCustomers[index] = { ...mockCustomers[index]!, ...data, updatedAt: new Date() };
    return applyInclude(mockCustomers[index]!, include);
  },
  delete: async (id: string): Promise<boolean> => {
    const index = mockCustomers.findIndex((c) => c.id === id);
    if (index !== -1) {
      mockCustomers.splice(index, 1);
      return true;
    }
    return false;
  },
  generateNextCode: async (): Promise<string> => {
    const nextNum = mockCustomers.length + 1;
    return `KH${nextNum.toString().padStart(3, "0")}`;
  },
};

export default customerRepository;
