import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";
import path from "path";

// Explicitly load .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Với Prisma 7, CLI sẽ dùng 'url' này để chạy migrate/pull.
    // Ta trỏ nó tới DIRECT_URL (cổng 5432) của Supabase.
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "",
  },
});
