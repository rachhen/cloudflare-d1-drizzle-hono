import { z } from "@hono/zod-openapi";
import { createSelectSchema } from "drizzle-zod";
import { users } from "../db/schema";

export const UserSchema = createSelectSchema(users)
  .omit({ hashedPassword: true })
  .openapi("User");

export const RegisterSchema = z
  .object({
    fullName: z.string().openapi({}),
    email: z.string().email(),
    password: z.string(),
  })
  .openapi("RegisterInput");

export const AuthResponseSchema = z.object({
  user: UserSchema,
  token: z.string(),
});

export const LoginSchema = z
  .object({
    email: z.string(),
    password: z.string(),
  })
  .openapi("LoginInput");

export const VerificationCodeSchema = z
  .object({
    code: z.string(),
  })
  .openapi("VerificationCodeInput");

export const RequestResetPasswordSchema = z
  .object({
    email: z.string().email(),
  })
  .openapi("RequestResetPasswordInput");

export const NewResetPasswordSchema = z
  .object({
    newPassword: z.string().min(6),
  })
  .openapi("SendResetPasswordInput");

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type VerificationCodeInput = z.infer<typeof VerificationCodeSchema>;
export type RequestResetPasswordInput = z.infer<
  typeof RequestResetPasswordSchema
>;
