import { Router } from "express";
import { renderIndex, renderNew, createBook } from "../controllers/books.controller.js";

const router = Router();

router.get("/", renderIndex);
router.get("/new", renderNew);
router.post("/add", createBook);

export default router;