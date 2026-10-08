import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const patientSchema = z.object({
  name: z.string().trim().min(1),
  age: z.number(),
  gender: z.string().trim().min(1),
  address: z.string().trim().min(1),
});

export const doctorSchema = z.object({
  name: z.string().trim().min(1),
  specialty: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
});
