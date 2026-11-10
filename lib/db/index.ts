import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const client = postgres(process.env.DATABASE_URL, {
  prepare: false,
  max: 5,
});

export const db = drizzle(client, { schema });
