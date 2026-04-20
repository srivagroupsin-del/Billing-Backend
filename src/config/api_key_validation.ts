import mysql from "mysql2/promise";

const apikeyPool = mysql.createPool({
  host: process.env.API_KEY_DB_HOST,
  user: process.env.API_KEY_DB_USER,
  password: process.env.API_KEY_DB_PASS,
  database: process.env.API_KEY_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export default apikeyPool;
