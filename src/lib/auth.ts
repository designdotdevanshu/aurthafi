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
        console.log("Attempting to send reset email to:", user.email);
        console.log("Reset URL:", url);
        console.log("From email:", process.env.RESEND_FROM_EMAIL);

        // Check if required environment variables are set
        if (!process.env.RESEND_API_KEY) {
          throw new Error("RESEND_API_KEY environment variable is not set");
        }
        if (!process.env.RESEND_FROM_EMAIL) {
          throw new Error("RESEND_FROM_EMAIL environment variable is not set");
        }

        const result = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL!, // e.g. "no-reply@yourdomain.com"
          // to: user.email,
          to: "design.devanshu@gmail.com",
          subject: "Reset Your Password",
          html: `
            <p>Hello ${user.name ?? user.email},</p>
            <p>You requested a password reset. Click the link below to set a new password. This link expires in 1 hour.</p>
            <p><a href="${url}" style="color: #2563EB;">Reset Password</a></p>
            <p>If you didn't request this, you can safely ignore this email.</p>
          `,
        });

        console.log("Email sent successfully:", result);
      } catch (error) {
        console.error("Failed to send reset email:", error);
        throw error; // Re-throw to let better-auth handle it
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
  },

  /** if no database is provided, the user data will be stored in memory.
   * Make sure to provide a database to persist user data **/
  plugins: [nextCookies()], // auto-set cookies on server actions
});
