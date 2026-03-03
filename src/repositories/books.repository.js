import pool from "../config/database.js";

const SORT_SQL = {
  recent: "created_at DESC, id DESC",
  rating: "rating DESC NULLS LAST, created_at DESC, id DESC",
  title: "LOWER(title) ASC, created_at DESC, id DESC"
};

export async function findAllByUserId(userId, sort = "recent") {
  const orderBy = SORT_SQL[sort] || SORT_SQL.recent;

  const result = await pool.query(`
        SELECT id, user_id, title, author, rating, notes, cover_id, created_at, updated_at
        FROM books
        WHERE user_id = $1
        ORDER BY ${orderBy}`, [userId]);
        
  return { books: result.rows };
}

export async function createBookForUser(userId, input, coverId) {
  const result = await pool.query(
    `INSERT INTO books (user_id, title, author, rating, notes, cover_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [userId, input.title, input.author, input.rating, input.notes, coverId]
  );

  return result.rows[0];
}

export async function findBookByIdForUser(id, userId) {
  const result = await pool.query(
    `SELECT id, user_id, title, author, rating, notes, cover_id
     FROM books
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  return result.rows[0] ?? null;
}

export async function updateBookByIdForUser(id, userId, input, coverId) {
  const result = await pool.query(
    `UPDATE books
     SET title = $1, author = $2, rating = $3, notes = $4, cover_id = $5, updated_at = NOW()
     WHERE id = $6 AND user_id = $7
     RETURNING id`,
    [input.title, input.author, input.rating, input.notes, coverId, id, userId]
  );

  return result.rows[0] ?? null;
}

export async function deleteBookByIdForUser(id, userId) {
  const result = await pool.query(
    "DELETE FROM books WHERE id = $1 AND user_id = $2 RETURNING id",
    [id, userId]
  );

  return result.rows[0] ?? null;
}