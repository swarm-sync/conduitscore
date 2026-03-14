import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_CLIENT_ID ?? "").trim(),
      clientSecret: (process.env.GOOGLE_CLIENT_SECRET ?? "").trim(),
    }),
    EmailProvider({
      from: (process.env.EMAIL_FROM ?? "noreply@conduitscore.com").trim(),
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const apiKey = (process.env.RESEND_API_KEY ?? "").trim();
        if (!apiKey) throw new Error("RESEND_API_KEY is not set or is empty");

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to: email,
            subject: "Sign in to ConduitScore",
            html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;"><h1 style="font-size:24px;font-weight:700;color:#0f0f0f;margin-bottom:8px;">Sign in to ConduitScore</h1><p style="color:#555;margin-bottom:32px;">Click the button below to sign in. This link expires in 24 hours.</p><a href="${url}" style="display:inline-block;background:#6c3bff;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px;">Sign in</a><p style="color:#999;font-size:12px;margin-top:32px;">If you didn't request this, you can ignore this email.</p></div>`,
            text: `Sign in to ConduitScore\n\nClick this link: ${url}\n\nIf you didn't request this, ignore this email.`,
          }),
        });

        if (!res.ok) {
          const body = await res.text();
          throw new Error(`Resend error ${res.status}: ${body}`);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify",
  },
};
