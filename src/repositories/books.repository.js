import pool from "../config/database.js";

export async function findAllByUserId(userId) {
  const result = await pool.query(`
        SELECT id, user_id, title, author, rating, notes, cover_id, created_at, updated_at
        FROM books
        WHERE user_id = $1`, [userId]);
  return { books: result.rows };
}

export async function createBookForUser(userId, input) {
  const result = await pool.query(
    `INSERT INTO books (user_id, title, author, rating, notes, cover_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [userId, input.title, input.author, input.rating, input.notes, input.cover_id]
  );

  return result.rows[0];
}