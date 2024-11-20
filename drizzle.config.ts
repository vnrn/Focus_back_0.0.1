import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "dirzzle/migrations",
  schema: "./src/db/schema/",
  dbCredentials: {
    url: process.env.DB_URL as string
  }
});
