import { type Customer } from "../../models/Customer.js";

export interface ICustomerRepository {
  findAll(): Promise<Customer[]>;
  findById(id: string): Promise<Customer | null>;
  findByUserId(userId: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findByIdentityCard(identityCard: string): Promise<Customer | null>;
  create(customer: Omit<Customer, "id" | "createdAt" | "updatedAt">): Promise<Customer>;
  update(id: string, customer: Partial<Customer>): Promise<Customer | null>;
  delete(id: string): Promise<boolean>;
  generateNextId(): Promise<string>; // Để tạo MaKH tiếp theo
}
