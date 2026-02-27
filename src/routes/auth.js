import { Router } from "express";
import { 
    renderRegister, 
    register,
    renderLogin 
} from "../controllers/authController.js";

const router = Router();

router.get("/register", renderRegister);
router.post("/register", register);
router.get("/login", renderLogin);

export default router;