import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DB_CONNECTION_STRING: z.string().min(1, "Invalid DB connection string"),
  JWT_SECRET: z.string().length(32, "Invalid JWT secret (must be 32 characters)"),
  PORT: z.string().regex(/^\d+$/).transform(Number).default("4000"),
  EMAIL_USER: z.string().email("Invalid email"),
  EMAIL_PASS: z.string().min(1, "Invalid email password"),
  STRIPE_SECRET_KEY: z.string().min(1, "Invalid Stripe secret key"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:");
  console.error(JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1);
}

const env = parsedEnv.data;
export default env;
