import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const verificationCodeSchema = z.object({
  code: z.string(),
});

export const sendResetPasswordSchema = z.object({
  email: z.string().email(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerificationCodeInput = z.infer<typeof verificationCodeSchema>;
export type SendResetPasswordInput = z.infer<typeof sendResetPasswordSchema>;
