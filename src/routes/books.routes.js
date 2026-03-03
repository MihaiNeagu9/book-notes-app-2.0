import { Router } from "express";
import { 
    renderIndex, 
    renderNew, 
    createBook, 
    renderEdit, 
    updateBook, 
    deleteBook 
} from "../controllers/books.controller.js";

const router = Router();

router.get("/", renderIndex);
router.get("/new", renderNew);
router.post("/add", createBook);
router.get("/edit/:id", renderEdit);
router.post("/update/:id", updateBook);
router.post("/delete/:id", deleteBook);

export default router;