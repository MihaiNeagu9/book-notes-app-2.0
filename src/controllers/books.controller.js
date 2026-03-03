import { 
  findAllByUserId, 
  createBookForUser, 
  findBookByIdForUser, 
  updateBookByIdForUser, 
  deleteBookByIdForUser 
} from "../repositories/books.repository.js";
import { fetchCoverId } from "../services/openLibrary.service.js";

function sanitizeOptional(value) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
}

function validateAndNormalizeBookInput(body) {
  const title = String(body.title ?? "").trim();
  const author = sanitizeOptional(body.author);
  const notes = sanitizeOptional(body.notes);
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
    value: { title, author, rating, notes }
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
    const { title, author } = parsed.value;
    const coverId = await fetchCoverId(title, author);

    await createBookForUser(req.user.id, parsed.value, coverId);
    return res.redirect("/");
  } catch (error) {
    console.error("Failed to create book:", error.message);
    return res.status(500).send("Failed to create book.");
  }
}

export async function renderEdit(req, res) {
  try {
    const book = await findBookByIdForUser(req.params.id, req.user.id);
    if (!book) {
      return res.status(404).send("Book not found.");
    }

    return res.render("edit", { sort: "recent", error: null, book });
  } catch (error) {
    console.error("Failed to load book:", error.message);
    return res.status(500).send("Failed to load book.");
  }
}

export async function updateBook(req, res) {
  const parsed = validateAndNormalizeBookInput(req.body);
  if (parsed.error) {
    return res.status(400).render("edit", {
      sort: "recent",
      error: parsed.error,
      book: { ...req.body, id: req.params.id }
    });
  }

  try {
    const { title, author } = parsed.value;
    const coverId = await fetchCoverId(title, author);
    const updated = await updateBookByIdForUser(req.params.id, req.user.id, parsed.value, coverId);
    if (!updated) {
      return res.status(404).send("Book not found.");
    }

    return res.redirect("/");
  } catch (error) {
    console.error("Failed to update book:", error.message);
    return res.status(500).send("Failed to update book.");
  }
}

export async function deleteBook(req, res) {
  try {
    const deleted = await deleteBookByIdForUser(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).send("Book not found.");
    }

    return res.redirect("/");
  } catch (error) {
    console.error("Failed to delete book:", error.message);
    return res.status(500).send("Failed to delete book.");
  }
}