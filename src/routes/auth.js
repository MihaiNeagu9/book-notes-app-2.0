import { Router } from "express";
import { renderLogin } from "../controllers/authController.js";

const router = Router();

router.get("/login", renderLogin);

export default router;