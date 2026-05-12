import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";
import path from "path";

// Explicitly load .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "",
    // directUrl: process.env.DIRECT_URL || "",
  },
  migrations: {
    seed: "tsx ./prisma/seed.ts",
  },
});
