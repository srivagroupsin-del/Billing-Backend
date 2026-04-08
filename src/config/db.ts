import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.BILLING_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
export const checkDBConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL connected successfully");
    connection.release();
  } catch (error) {
    console.error("MySQL connection failed:", error);
  }
};

export default pool;
