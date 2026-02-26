CREATE TABLE IF NOT EXISTS books (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  rating SMALLINT CHECK (rating BETWEEN 1 AND 10),
  notes TEXT,
  cover_id VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
CREATE INDEX IF NOT EXISTS idx_books_user_rating ON books(user_id, rating DESC);
CREATE INDEX IF NOT EXISTS idx_books_user_title ON books(user_id, title);
CREATE INDEX IF NOT EXISTS idx_books_user_created_at ON books(user_id, created_at DESC);
