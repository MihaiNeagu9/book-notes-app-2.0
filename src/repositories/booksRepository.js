import pool from "../config/database.js";

const ORDER_BY_MAP = {
  recent: "created_at DESC",
  rating: "rating DESC NULLS LAST",
  title: "title ASC"
};

export function normalizeSort(sort) {
  return Object.hasOwn(ORDER_BY_MAP, sort) ? sort : "recent";
}

export async function findAllByUserId(userId, sort) {
  const safeSort = normalizeSort(sort);
  const orderBy = ORDER_BY_MAP[safeSort];

  const query = `
    SELECT id, user_id, title, author, rating, notes, cover_id, created_at, updated_at
    FROM books
    WHERE user_id = $1
    ORDER BY ${orderBy}
  `;

  const result = await pool.query(query, [userId]);
  return { books: result.rows, sort: safeSort };
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

export async function findBookByIdForUser(id, userId) {
  const result = await pool.query(
    `SELECT id, user_id, title, author, rating, notes, cover_id
     FROM books
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  return result.rows[0] ?? null;
}

export async function updateBookByIdForUser(id, userId, input) {
  const result = await pool.query(
    `UPDATE books
     SET title = $1, author = $2, rating = $3, notes = $4, cover_id = $5, updated_at = NOW()
     WHERE id = $6 AND user_id = $7
     RETURNING id`,
    [input.title, input.author, input.rating, input.notes, input.cover_id, id, userId]
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
