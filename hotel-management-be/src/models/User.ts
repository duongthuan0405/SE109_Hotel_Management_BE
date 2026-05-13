export type UserRole = "Admin" | "Manager" | "Receptionist" | "Customer";

export type User = {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
};
