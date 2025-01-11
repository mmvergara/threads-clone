import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/.server/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",

  dbCredentials: {
    url: `file:data/local.db`,
  },
});
