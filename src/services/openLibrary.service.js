import axios from "axios";

/**
 * Search for cover id (cover_i) in the Open Library Search API.
 * Returns number | null (fallback safe).
*/
export async function fetchCoverId(title, author) {
  try {
    const qTitle = (title ?? "").trim();
    const qAuthor = (author ?? "").trim();

    if (!qTitle) return null;

    // Build the query; author is optional
    const q = qAuthor ? `${qTitle} ${qAuthor}` : qTitle;

    const url = "https://openlibrary.org/search.json";
    const response = await axios.get(url, {
      params: { q, limit: 1 },
      timeout: 7000,
    });

    const doc = response?.data?.docs?.[0];
    const coverId = doc?.cover_i;

    return Number.isFinite(coverId) ? coverId : null;
  } catch (err) {
    // Don't block the application if the API goes down
    console.error("OpenLibrary fetch error:", err?.message || err);
    return null;
  }
}