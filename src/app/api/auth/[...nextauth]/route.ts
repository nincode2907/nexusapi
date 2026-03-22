import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// ─────────────────────────────────────────────
// NextAuth Route Handler
// Handles signin, signout, callback, and session APIs
// ─────────────────────────────────────────────

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
