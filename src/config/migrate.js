import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./database.js";

// Access the src/migrations directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.join(__dirname, "..", "migrations");

// Create the internal migration table
async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

// Access migrations (only sql files and alphabetically ordered)
async function getMigrationFiles() {
  const files = await fs.readdir(migrationsDir);
  return files
    .filter((file) => file.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));
}

// Read the applied migrations (eliminate duplicates)
async function getAppliedMigrationNames() {
  const result = await pool.query("SELECT name FROM schema_migrations");
  return new Set(result.rows.map((row) => row.name));
}

// Apply application migrations
async function applyMigration(filename) {
  const filePath = path.join(migrationsDir, filename);
  const sql = (await fs.readFile(filePath, "utf8")).trim();

  if (!sql) {
    console.log(`Skipping empty migration: ${filename}`);
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(sql);
    await client.query(
      "INSERT INTO schema_migrations (name) VALUES ($1)",
      [filename]
    );
    await client.query("COMMIT");
    console.log(`Applied migration: ${filename}`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error(`Migration failed (${filename}): ${error.message}`);
  } finally {
    client.release();
  }
}

// Main flow
async function runMigrations() {
  await ensureMigrationsTable();

  const files = await getMigrationFiles();
  const applied = await getAppliedMigrationNames();

  for (const filename of files) {
    if (!applied.has(filename)) {
      await applyMigration(filename);
    }
  }

  console.log("Migrations are up to date.");
}

runMigrations()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
  