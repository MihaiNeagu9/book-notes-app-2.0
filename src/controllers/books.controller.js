import { findAllByUserId } from "../repositories/books.repository.js";

export async function renderIndex(req, res) {
    try {
        const { books } = await findAllByUserId(req.user.id);
        return res.render("index", { books, sort: "recent" });
    } catch (error) {
        console.error("Failed to load books:", error.message);
        return res.status(500).send("Failed to load books.");
    }
}
