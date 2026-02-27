import { Router } from "express";
import {
  login,
  logout,
  register,
  renderLogin,
  renderRegister
} from "../controllers/authController.js";

const router = Router();

router.get("/register", renderRegister);
router.post("/register", register);
router.get("/login", renderLogin);
router.post("/login", login);
router.post("/logout", logout);

export default router;
