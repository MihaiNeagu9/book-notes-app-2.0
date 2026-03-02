import express from "express";
import app from "./app.js";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import booksRoutes from "./routes/books.routes.js";
import { requireAuth, attachCurrentUser } from "./middlewares/auth.middleware.js";

const PORT = process.env.APP_PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "..", "public");

// Global settings
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));
app.use(authRoutes);
app.use(attachCurrentUser);
app.use(requireAuth, booksRoutes);


app.listen(PORT, () => {
    console.log(`Book notes app listening on http://localhost:${PORT}`);
});