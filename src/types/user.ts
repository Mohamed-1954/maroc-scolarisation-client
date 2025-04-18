import z from "zod";

export enum UserRole {
  ADMIN = "admin",
  ACCOUNTANT = "accountant",
  MANAGER = "manager",
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(UserRole),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  lastLogin: z.date().optional(),
});
export type UserType = z.infer<typeof UserSchema>;