import { Router } from "express";
import { renderIndex, renderNew } from "../controllers/books.controller.js";

const router = Router();

router.get("/", renderIndex);
router.get("/new", renderNew);

export default router;