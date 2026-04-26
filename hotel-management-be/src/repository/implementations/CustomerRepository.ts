import { type ICustomerRepository } from "../types/ICustomerRepository.js";
import { type Customer } from "../../models/Customer.js";

const mockCustomers: Customer[] = [
  {
    id: "cust-1",
    userId: "user-2", // customer1 account
    customerId: "KH001",
    fullName: "Nguyễn Khách Hàng",
    identityCard: "123456789",
    phone: "0901234567",
    email: "customer1@example.com",
    address: "123 Đường ABC, HCM",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const customerRepository: ICustomerRepository = {
  findAll: async (): Promise<Customer[]> => {
    return mockCustomers;
  },
  findById: async (id: string): Promise<Customer | null> => {
    return mockCustomers.find(c => c.id === id) || null;
  },
  findByUserId: async (userId: string): Promise<Customer | null> => {
    return mockCustomers.find(c => c.userId === userId) || null;
  },
  findByEmail: async (email: string): Promise<Customer | null> => {
    return mockCustomers.find(c => c.email === email) || null;
  },
  findByIdentityCard: async (identityCard: string): Promise<Customer | null> => {
    return mockCustomers.find(c => c.identityCard === identityCard) || null;
  },
  create: async (customer: Omit<Customer, "id" | "createdAt" | "updatedAt">): Promise<Customer> => {
    const newCustomer: Customer = {
      ...customer,
      id: `cust-${mockCustomers.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCustomers.push(newCustomer);
    return newCustomer;
  },
  update: async (id: string, data: Partial<Customer>): Promise<Customer | null> => {
    const index = mockCustomers.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const current = mockCustomers[index]!;
    const updatedCustomer: Customer = {
      id: current.id,
      userId: data.userId !== undefined ? data.userId : current.userId,
      customerId: data.customerId !== undefined ? data.customerId : current.customerId,
      fullName: data.fullName !== undefined ? data.fullName : current.fullName,
      identityCard: data.identityCard !== undefined ? data.identityCard : current.identityCard,
      phone: data.phone !== undefined ? data.phone : current.phone,
      email: data.email !== undefined ? data.email : current.email,
      address: data.address !== undefined ? data.address : current.address,
      createdAt: current.createdAt,
      updatedAt: new Date(),
    };
    
    mockCustomers[index] = updatedCustomer;
    return updatedCustomer;
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
