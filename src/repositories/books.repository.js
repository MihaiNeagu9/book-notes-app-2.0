import pool from "../config/database.js";

export async function findAllByUserId(userId) {
  const result = await pool.query(`
        SELECT id, user_id, title, author, rating, notes, cover_id, created_at, updated_at
        FROM books
        WHERE user_id = $1`, [userId]);
  return { books: result.rows };
}