import { type ICustomerRepository, type CustomerInclude } from "../types/ICustomerRepository.js";
import { type Customer } from "../../models/Customer.js";
import userRepository from "./UserRepository.js";

const mockCustomers: Customer[] = [
  {
    id: "cust-1",
    userId: "user-2", // customer1 account
    code: "KH001",
    fullName: "Nguyễn Khách Hàng",
    identityCard: "123456789",
    phone: "0901234567",
    email: "customer1@example.com",
    address: "123 Đường ABC, HCM",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const applyInclude = async (customer: Customer, include?: CustomerInclude): Promise<Customer> => {
  if (!include) return { ...customer };

  const result = { ...customer };

  if (include.user) {
    result.user = (await userRepository.findById(customer.userId || "")) || undefined;
  }

  return result;
};

const customerRepository: ICustomerRepository = {
  findAll: async (include): Promise<Customer[]> => {
    return Promise.all(mockCustomers.map(c => applyInclude(c, include)));
  },
  findById: async (id, include): Promise<Customer | null> => {
    const customer = mockCustomers.find(c => c.id === id);
    if (!customer) return null;
    return applyInclude(customer, include);
  },
  findByUserId: async (userId, include): Promise<Customer | null> => {
    const customer = mockCustomers.find(c => c.userId === userId);
    if (!customer) return null;
    return applyInclude(customer, include);
  },
  findByCode: async (code, include): Promise<Customer | null> => {
    const customer = mockCustomers.find(c => c.code === code);
    if (!customer) return null;
    return applyInclude(customer, include);
  },
  findByEmail: async (email, include): Promise<Customer | null> => {
    const customer = mockCustomers.find(c => c.email === email);
    if (!customer) return null;
    return applyInclude(customer, include);
  },
  findByIdentityCard: async (identityCard, include): Promise<Customer | null> => {
    const customer = mockCustomers.find(c => c.identityCard === identityCard);
    if (!customer) return null;
    return applyInclude(customer, include);
  },
  create: async (customer: Omit<Customer, "id" | "createdAt" | "updatedAt" | "user">): Promise<Customer> => {
    const newCustomer: Customer = {
      ...customer,
      id: `cust-${mockCustomers.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCustomers.push(newCustomer);
    return newCustomer;
  },
  update: async (id, data, include): Promise<Customer | null> => {
    const index = mockCustomers.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const current = mockCustomers[index]!;
    const updatedCustomer: Customer = {
      ...current,
      ...data,
      updatedAt: new Date(),
    } as Customer;
    
    mockCustomers[index] = updatedCustomer;
    return applyInclude(updatedCustomer, include);
  },
  delete: async (id: string): Promise<boolean> => {
    const index = mockCustomers.findIndex(c => c.id === id);
    if (index === -1) return false;
    mockCustomers.splice(index, 1);
    return true;
  },
  generateNextId: async (): Promise<string> => {
    const count = mockCustomers.length + 1;
    return `KH${count.toString().padStart(3, "0")}`;
  }
};

export default customerRepository;
