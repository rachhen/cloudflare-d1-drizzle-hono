import { Context } from "hono";
import { Resend } from "resend";

import { MyEnv } from "../types/env";

export async function sendVerificationCode(
  c: Context<MyEnv>,
  email: string,
  verificationCode: string
) {
  const resend = new Resend(c.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "Verification Code <noreply@rachhen.com>",
    to: [email],
    subject: "Verification Code",
    text: `Your Email Verification Code is: ${verificationCode}`,
    tags: [
      {
        name: "category",
        value: "confirm_email",
      },
    ],
  });
}

export async function sendPasswordResetToken(
  c: Context<MyEnv>,
  email: string,
  verificationToken: string
) {
  const resend = new Resend(c.env.RESEND_API_KEY);

  const verificationLink = `${c.env.CLIENT_URL}/reset-password/${verificationToken}`;
  if (process.env.NODE_ENV !== "production") {
    console.log(verificationLink);
  }

  await resend.emails.send({
    from: "Reset password <noreply@rachhen.com>",
    to: [email],
    subject: "Reset password",
    text: `Your reset password link: ${verificationLink}`,
    tags: [
      {
        name: "category",
        value: "confirm_email",
      },
    ],
  });
}
