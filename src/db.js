import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const connection = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://group20:zQyKAqLh396ABPwzrBzvQB4nxUjjEFfb@dpg-ceqab1qrrk0eo0t9s9dg-a.oregon-postgres.render.com/linkr_hepu",
  ssl: {
    rejectUnauthorized: false,
  },
});

export default connection;