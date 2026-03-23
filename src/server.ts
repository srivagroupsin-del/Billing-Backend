import dotenv from "dotenv";
dotenv.config(); // 👈 MUST BE FIRST

import app from "./app";
import { checkDBConnection } from "./config/db";

const PORT = Number( process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0",async () => {
  console.log(`Server running on ${PORT}`);
   // Check MySQL connection
  await checkDBConnection();
});