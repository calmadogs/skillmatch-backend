import { Router } from "express";
import { getMe } from "../controllers/getMeController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticateToken, getMe);

export default router;
