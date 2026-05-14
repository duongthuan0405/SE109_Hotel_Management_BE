import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  JWT_SECRET: z.string().length(32, "Invalid JWT secret (must be 32 characters)"),
  PORT: z.string().regex(/^\d+$/).transform(Number).default("4000"),
  EMAIL_USER: z.string().email("Invalid email"),
  EMAIL_PASS: z.string().min(1, "Invalid email password"),
  OTP_LENGTH: z.string().length(1, "Invalid OTP length (must be 1 digit)").regex(/^\d+$/).transform(Number),
  OTP_DURATION_IN_MINUTES: z.string().regex(/^\d+$/).transform(Number),
  DATABASE_URL: z.string().min(1, "Invalid DB connection string"),
  DIRECT_URL: z.string().min(1, "Invalid DB connection string"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  FRONTEND_URL: z.string().url().optional().default("http://localhost:5173"),
  
  BACKEND_URL: z.string().url().optional().default("http://localhost:4000"),
  MOMO_PARTNER_CODE: z.string().default("MOMOBKUN20180529").transform(s => s.trim()),
  MOMO_ACCESS_KEY: z.string().default("klm05nrEFTVKMM6g").transform(s => s.trim()),
  MOMO_SECRET_KEY: z.string().default("at67qH6m05nx7sfFO0S7FQj95c885E2I").transform(s => s.trim()),
  MOMO_API_URL: z.string().url().default("https://test-payment.momo.vn/v2/gateway/api/create").transform(s => s.trim()),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:");
  console.error(JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1);
}

const env = parsedEnv.data;
export default env;
