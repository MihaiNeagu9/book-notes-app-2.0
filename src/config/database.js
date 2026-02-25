import pg from "pg";

// Connection pool to PostgreSQL server
const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// Error check
pool.on("error", (err) => {
  console.error("Unexpected error", err);
  process.exit(-1);
});

export default pool;