import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  completionAt: integer("completion_at", { mode: "timestamp" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
}));

export const users = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password"),
  fullName: text("full_name"),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(sessions),
  emailVerificationCode: one(emailVerificationCodes),
  tasks: many(tasks),
}));

export const sessions = sqliteTable("sessions", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const emailVerificationCodes = sqliteTable("email_verification_codes", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  code: text("code").notNull(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id),
  email: text("email").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

export const emailVerificationCodesRelations = relations(
  emailVerificationCodes,
  ({ one }) => ({
    user: one(users, {
      fields: [emailVerificationCodes.userId],
      references: [users.id],
    }),
  })
);

export type EmailVerificationCodes = typeof emailVerificationCodes.$inferSelect;
export type NewEmailVerificationCodes =
  typeof emailVerificationCodes.$inferInsert;

export const passwordResetTokens = sqliteTable("password_reset_tokens", {
  tokenHash: text("token_hash").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

export const passwordResetTokensRelations = relations(
  passwordResetTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [passwordResetTokens.userId],
      references: [users.id],
    }),
  })
);
