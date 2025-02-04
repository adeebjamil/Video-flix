import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextApiHandler } from "next";

const authHandler: NextApiHandler = (req, res) =>
  NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
  });

export const GET = authHandler;
export const POST = authHandler;