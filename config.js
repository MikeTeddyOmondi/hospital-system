import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define the schema for environment variables
const envSchema = z.object({
  DB_PASSWORD: z.string().nonempty("DB_PASSWORD is required"),
  DB_HOST: z.string().nonempty("DB_HOST is required"),
  DB_USER: z.string().nonempty("DB_USER is required"),
  DB_NAME: z.string().nonempty("DB_NAME is required"),
  DB_PORT: z.string().default("3306").transform(Number), 
  PORT: z.string().default("3000").transform(Number),
  SESSION_SECRET: z.string().nonempty("SESSION_SECRET is required"),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Parse and validate the environment variables
const env = envSchema.safeParse(process.env);

// Check for errors
if (!env.success) {
  console.error("❌ Invalid environment variables:", env.error.format());
  process.exit(1); // Exit the application if validation fails
}

// Destructure validated and typed environment variables
export const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME, NODE_ENV, PORT } = env.data;
