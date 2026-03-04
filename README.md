# Book Notes - Full-Stack Web Application (v2.0)

**Book Notes 2.0** is a full-stack web application for tracking books you have read, writing personal notes, and rating each title.

Compared to the first version, this release adds **user authentication and per-user data isolation**. Each user can create an account, sign in, and manage only their own book collection.

The app uses **Node.js, Express.js, PostgreSQL, EJS, and Open Library API integration**.

---

## Overview

- Server-rendered web application (EJS)
- PostgreSQL persistence with SQL migrations
- Authentication with JWT stored in HTTP-only cookie
- Per-user CRUD for books (multi-user ready)
- External API integration (Open Library)
- Layered architecture (routes, controllers, repositories, services)

---

## Screenshots

Screenshots...

---

## Key Features

- User registration and login
- Password hashing with `bcrypt`
- JWT-based authentication (7-day session cookie)
- Route protection for authenticated users
- CRUD operations for books
- Book ownership checks (`user_id`) on read/update/delete
- Sorting support:
  - Most recent
  - Rating (descending)
  - Title (A -> Z)
- Automatic cover fetching from Open Library Search API
- Graceful fallback when no cover is available
- SQL migrations for repeatable schema setup

---

## Technical Skills

- Designed and implemented an authenticated full-stack app using Express and PostgreSQL
- Built secure auth flows (register/login/logout) with JWT cookies and password hashing
- Implemented per-user authorization in repository queries to prevent cross-user access
- Structured the backend using clear layers: routes, controllers, repositories, and services
- Added migration-based database lifecycle (`schema_migrations` + SQL files)
- Integrated Open Library API for automatic book cover metadata lookup
- Implemented server-side validation for book input and rating constraints
- Built reusable EJS partials and clean server-rendered UI flows
- Managed environment configuration with `dotenvx`

---

## Tech Stack

| Layer       | Technology                           |
|-------------|--------------------------------------|
| Backend     | Node.js, Express.js                  |
| Database    | PostgreSQL                           |
| Auth        | JWT (`jsonwebtoken`), `bcrypt`       |
| Templating  | EJS                                  |
| API         | Open Library Search API              |
| HTTP Client | Axios                                |
| Styling     | CSS (custom, no frameworks)          |
| Env Runtime | `@dotenvx/dotenvx`                   |

---

## Project Structure

```text
book-notes-app-2.0/
|-- public/
|   |-- styles/
|   |   `-- main.css
|   `-- images/
|       `-- image.png
|
|-- src/
|   |-- config/
|   |   |-- database.js
|   |   `-- migrate.js
|   |-- controllers/
|   |   |-- auth.controller.js
|   |   `-- books.controller.js
|   |-- middlewares/
|   |   `-- auth.middleware.js
|   |-- migrations/
|   |   |-- 001_create_users.sql
|   |   `-- 002_create_books.sql
|   |-- repositories/
|   |   |-- users.repository.js
|   |   `-- books.repository.js
|   |-- routes/
|   |   |-- auth.routes.js
|   |   `-- books.routes.js
|   |-- services/
|   |   `-- openLibrary.service.js
|   |-- app.js
|   `-- server.js
|
|-- views/
|   |-- partials/
|   |   |-- head.ejs
|   |   |-- header.ejs
|   |   `-- footer.ejs
|   |-- index.ejs
|   |-- new.ejs
|   |-- edit.ejs
|   |-- login.ejs
|   `-- register.ejs
|
|-- .env
|-- package.json
`-- README.md
```

---

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
```

---

## External API

**Open Library Search API**

- Used to search books and retrieve `cover_i`
- Cover URLs are generated dynamically:

```text
https://covers.openlibrary.org/b/id/{cover_id}-M.jpg
```

---

## Local Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables (`.env`)
```env
APP_PORT=4000
JWT_SECRET=your_long_random_secret
DB_USER=postgres
DB_HOST=localhost
DB_NAME=books
DB_PASSWORD=your_password
DB_PORT=5432
```

### 3. Run migrations
```bash
npm run migrate
```

### 4. Start the app
```bash
npm run start
```

Visit:
```text
http://localhost:4000
```

For development:
```bash
npm run dev
```

---

## Design Decisions

- Server-side rendering with EJS for simple, fast pages
- JWT in HTTP-only cookie to reduce token exposure in client-side scripts
- Authorization checks at query level (`... WHERE id = $1 AND user_id = $2`)
- SQL migrations for reproducible setup across environments
- API failure fallback so book CRUD still works without external service

---

## Possible Enhancements

- CSRF protection on form actions
- Password reset and email verification
- Search and pagination for large collections
- Unit/integration tests for auth and repositories
- Docker setup for app + PostgreSQL
- Production deployment with secure cookie/domain settings

---

## Author

Developed by **Neagu Mihai Daniel**
