import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create a connection pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  port: process.env.DB_PORT || 3306,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "restobay",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};
