import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import authRoutes from "./routes/auth.js";
import booksRoutes from "./routes/books.js";
import { attachCurrentUser, requireAuth } from "./middleware/authMiddleware.js";

const PORT = process.env.APP_PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(attachCurrentUser);

app.use(authRoutes);
app.use(requireAuth, booksRoutes);

app.listen(PORT, () => {
  console.log(`Book notes app listening on http://localhost:${PORT}`);
});
