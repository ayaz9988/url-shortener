// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/client.node"; // Node/Postgres client (✅ for CLI)
import * as schema from "../db/schema"; // optional but recommended

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema, // lets Better Auth understand your Drizzle tables at runtime
  }),
  emailAndPassword: {
    enabled: true,
  },
});

export default auth;
