import { findAllByUserId, createBookForUser } from "../repositories/books.repository.js";

function sanitizeOptional(value) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function validateAndNormalizeBookInput(body) {
  const title = String(body.title ?? "").trim();
  const author = sanitizeOptional(body.author);
  const notes = sanitizeOptional(body.notes);
  const cover_id = sanitizeOptional(body.cover_id);
  const ratingRaw = String(body.rating ?? "").trim();

  if (!title) {
    return { error: "Title is required." };
  }

  let rating = null;
  if (ratingRaw) {
    rating = Number(ratingRaw);
    if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
      return { error: "Rating must be an integer between 1 and 10." };
    }
  }

  return {
    value: { title, author, rating, notes, cover_id }
  };
}

export async function renderIndex(req, res) {
    try {
        const { books } = await findAllByUserId(req.user.id);
        return res.render("index", { books, sort: "recent" });
    } catch (error) {
        console.error("Failed to load books:", error.message);
        return res.status(500).send("Failed to load books.");
    }
}

export function renderNew(req, res) {
  return res.render("new", {
    sort: "recent",
    error: null,
    form: { title: "", author: "", rating: "", notes: "", cover_id: "" }
  });
}

export async function createBook(req, res) {
  const parsed = validateAndNormalizeBookInput(req.body);
  if (parsed.error) {
    return res.status(400).render("new", {
      sort: "recent",
      error: parsed.error,
      form: req.body
    });
  }

  try {
    await createBookForUser(req.user.id, parsed.value);
    return res.redirect("/");
  } catch (error) {
    console.error("Failed to create book:", error.message);
    return res.status(500).send("Failed to create book.");
  }
}