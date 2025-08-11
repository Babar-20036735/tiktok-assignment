import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle", 
  dialect: "postgresql",
  dbCredentials: {
    host: "babar123.postgres.database.azure.com",
    user: "babar",
    password: "Ubuntu@24.04", 
    database: "postgres",
    port: 5432,
    ssl: {
      rejectUnauthorized: false,
  
    }
  }
});