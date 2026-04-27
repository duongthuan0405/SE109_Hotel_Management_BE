import { type Customer } from "../../models/Customer.js";

export type CustomerInclude = {
  user?: boolean;
};

export interface ICustomerRepository {
  findAll(include?: CustomerInclude): Promise<Customer[]>;
  findById(id: string, include?: CustomerInclude): Promise<Customer | null>;
  findByUserId(userId: string, include?: CustomerInclude): Promise<Customer | null>;
  findByCode(code: string, include?: CustomerInclude): Promise<Customer | null>;
  findByEmail(email: string, include?: CustomerInclude): Promise<Customer | null>;
  findByIdentityCard(identityCard: string, include?: CustomerInclude): Promise<Customer | null>;
  create(customer: Omit<Customer, "id" | "createdAt" | "updatedAt" | "user">): Promise<Customer>;
  update(id: string, customer: Partial<Omit<Customer, "user">>, include?: CustomerInclude): Promise<Customer | null>;
  delete(id: string): Promise<boolean>;
  generateNextId(): Promise<string>; // Để tạo MaKH tiếp theo
}
