import { Resend } from "resend";
import { db } from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: 3600, // 1 hour
    autoSignIn: false,
    async sendResetPassword({ user, url }) {
      try {
        if (!process.env.RESEND_API_KEY) {
          throw new Error("RESEND_API_KEY environment variable is not set");
        }
        if (!process.env.RESEND_FROM_EMAIL) {
          throw new Error("RESEND_FROM_EMAIL environment variable is not set");
        }

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL!, // e.g. "no-reply@yourdomain.com"
          to: user.email,
          subject: "Reset Your Password",
          html: `<div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #111827; padding: 24px; border-radius: 8px; max-width: 480px; margin: 0 auto; border: 1px solid #e5e7eb">
                  <h1 style="font-size: 20px; font-weight: 800; margin: 0 0 16px; background: linear-gradient(to right, #2563eb, #9333ea); -webkit-background-clip: text; -webkit-text-fill-color: transparent">Reset Your Password</h1>
                  <p style="margin: 0 0 16px">Hello ${user.name ?? user.email},</p>
                  <p style="margin: 0 0 16px">You requested a password reset. Click the button below to set a new password. This link expires in 1 hour.</p>
                  <a href="${url}" style="display: inline-block; padding: 12px 20px; font-weight: 600; color: #fff; background: linear-gradient(to bottom right, #2563eb, #9333ea); border-radius: 6px; text-decoration: none"> Reset Password </a>
                  <p style="margin: 24px 0 0; font-size: 14px; color: #6b7280">If you didn't request this, you can safely ignore this email.</p>
                </div>`,
        });
      } catch (error) {
        console.error("Failed to send reset email:", error);
        throw error;
      }
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    },
  },

  /** if no database is provided, the user data will be stored in memory.
   * Make sure to provide a database to persist user data **/
  plugins: [nextCookies()], // auto-set cookies on server actions
});
