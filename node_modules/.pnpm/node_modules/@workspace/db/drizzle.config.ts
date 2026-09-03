import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const connectionString = process.env["DATABASE_URL"];

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required but was not provided.");
}

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
