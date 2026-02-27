import { Router } from "express";
import { renderLogin, renderRegister } from "../controllers/authController.js";

const router = Router();

router.get("/register", renderRegister);
router.get("/login", renderLogin);

export default router;