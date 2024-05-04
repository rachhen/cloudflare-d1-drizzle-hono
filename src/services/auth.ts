import { Context } from "hono";
import { Scrypt, generateIdFromEntropySize, User as LuciaUser } from "lucia";
import { HTTPException } from "hono/http-exception";
import { alphabet, generateRandomString, sha256 } from "oslo/crypto";
import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import { encodeHex } from "oslo/encoding";
import { eq } from "drizzle-orm";

import {
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerificationCodeInput,
} from "../schema/auth";
import {
  User,
  emailVerificationCodes,
  passwordResetTokens,
  users,
} from "../db/schema";
import { sendPasswordResetToken, sendVerificationCode } from "../utils/email";

export const cleanUser = (user: User): User => {
  return Object.assign({}, user, {
    hashedPassword: undefined,
  });
};

export const register = async (c: Context, input: RegisterInput) => {
  const db = c.get("db");

  const hashedPassword = await new Scrypt().hash(input.password);
  const userId = generateIdFromEntropySize(10); // 16 characters long

  const existingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, input.email),
  });

  if (existingUser) {
    throw new HTTPException(401, { message: "Email is already used" });
  }

  const [result] = await db
    .insert(users)
    .values({
      id: userId,
      email: input.email,
      fullName: input.fullName,
      hashedPassword,
      emailVerified: false,
    })
    .returning();

  const verificationCode = await generateEmailVerificationCode(
    c,
    userId,
    input.email
  );
  await sendVerificationCode(c, input.email, verificationCode);

  const user: User = cleanUser(result);

  return user;
};

export const login = async (c: Context, input: LoginInput) => {
  const db = c.get("db");

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, input.email),
  });

  if (!user) {
    throw new HTTPException(400, { message: "Invalid credentials" });
  }

  const isMatch = await new Scrypt().verify(
    user.hashedPassword!,
    input.password
  );

  if (!isMatch) {
    throw new HTTPException(400, { message: "Invalid credentials" });
  }

  return cleanUser(user);
};

export const emailVerification = async (
  c: Context,
  input: VerificationCodeInput
) => {
  const user = c.var.user;

  const validCode = await verifyVerificationCode(c, user, input.code);
  if (!validCode) {
    throw new HTTPException(400, { message: "Invalid code" });
  }

  await c.var.lucia.invalidateUserSessions(user.id);
  await c.var.db
    .update(users)
    .set({ emailVerified: true })
    .where(eq(users.id, user.id))
    .returning();
};

export const sendResetPassword = async (
  c: Context,
  input: ResetPasswordInput
) => {
  const user = await c.var.db.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (!user || !user.emailVerified) {
    throw new HTTPException(400, { message: "Invalid email" });
  }

  const verificationToken = await createPasswordResetToken(c, user.id);
  await sendPasswordResetToken(c, input.email, verificationToken);
};

export const resetPassword = async (
  c: Context,
  verificationToken: string,
  newPassword: string
) => {
  const tokenHash = encodeHex(
    await sha256(new TextEncoder().encode(verificationToken))
  );

  const token = await c.var.db.query.passwordResetTokens.findFirst({
    where: eq(passwordResetTokens.tokenHash, tokenHash),
  });

  if (token) {
    await c.var.db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.tokenHash, tokenHash));
  }

  if (!token || !isWithinExpirationDate(token.expiresAt)) {
    throw new HTTPException(400, { message: "Invalid token" });
  }

  await c.var.lucia.invalidateUserSessions(token.userId);
  const hashedPassword = await new Scrypt().hash(newPassword);
  await c.var.db
    .update(users)
    .set({ hashedPassword })
    .where(eq(users.id, token.userId));

  return token;
};

async function generateEmailVerificationCode(
  c: Context,
  userId: string,
  email: string
) {
  const db = c.var.db;

  await db
    .delete(emailVerificationCodes)
    .where(eq(emailVerificationCodes.userId, userId));

  const code = generateRandomString(8, alphabet("0-9"));
  await db.insert(emailVerificationCodes).values({
    userId,
    email,
    code,
    expiresAt: createDate(new TimeSpan(15, "m")),
  });

  return code;
}

async function verifyVerificationCode(
  c: Context,
  user: LuciaUser,
  code: string
): Promise<boolean> {
  const db = c.var.db;

  const dbCode = await db.query.emailVerificationCodes.findFirst({
    where: eq(emailVerificationCodes.userId, user.id),
  });

  if (!dbCode || dbCode.code !== code) {
    return false;
  }

  await db
    .delete(emailVerificationCodes)
    .where(eq(emailVerificationCodes.userId, user.id));

  if (!isWithinExpirationDate(dbCode.expiresAt)) {
    return false;
  }

  if (dbCode.email !== user.email) {
    return false;
  }

  return true;
}

async function createPasswordResetToken(c: Context, userId: string) {
  await c.var.db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.userId, userId));

  const tokenId = generateIdFromEntropySize(25);
  const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tokenId)));
  await c.var.db.insert(passwordResetTokens).values({
    tokenHash,
    userId,
    expiresAt: createDate(new TimeSpan(2, "h")),
  });

  return tokenId;
}
