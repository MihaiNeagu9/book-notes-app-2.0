import { Router } from "express";
import { 
    renderRegister, 
    register,
    renderLogin,
    login 
} from "../controllers/authController.js";

const router = Router();

router.get("/register", renderRegister);
router.post("/register", register);
router.get("/login", renderLogin);
router.post("/login", login)

export default router;