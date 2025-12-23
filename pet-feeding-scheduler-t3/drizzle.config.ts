import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/better-auth/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:auth.db",
  },
});
