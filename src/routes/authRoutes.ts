import { Router } from "express";
import { register, login } from "../controllers/authController";

const router = Router();

// POST - Registrar novo usuário
router.post("/register", register);

// POST - Login de usuário
router.post("/login", login);

export default router;
