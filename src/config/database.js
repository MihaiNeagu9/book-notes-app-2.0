import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

const res = await pool.query("SELECT * FROM books");
console.log(res.rows);
await pool.end();