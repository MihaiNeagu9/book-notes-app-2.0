import { Router } from "express";
import { renderIndex } from "../controllers/books.controller.js";

const router = Router();

router.get("/", renderIndex);

export default router;