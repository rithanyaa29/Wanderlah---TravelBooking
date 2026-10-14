
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from .env");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function testDatabaseConnection() {
  const result = await pool.query("SELECT NOW() AS current_time");
  console.log("Neon database connected successfully!");
  console.log("Database time:", result.rows[0].current_time);
}
