import { drizzle } from "drizzle-orm/bun-sql";
import { sql } from "bun";
import * as schema from "./schema";

// Bun.sql will use DATABASE_URL and detect Postgres automatically
// DATABASE_URL must be set in env
export const db = drizzle(sql, { schema });
