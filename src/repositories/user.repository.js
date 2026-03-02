import pool from "../config/database.js";

export async function findUserByEmail(email) {
  const result = await pool.query(
    "SELECT id, name, email, password_hash FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0] ?? null;
}

export async function createUser(user) {
    const result = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email`,
    [user.name, user.email, user.password_hash]
  );

  return result.rows[0];
}