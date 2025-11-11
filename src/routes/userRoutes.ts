import { Router } from "express";
import { createUser, deleteUser, getAllUsers, updateUser } from "../controllers/userController";
import { authenticateToken } from "../middleware/authMiddleware";
import { isAdmin, isOwnerOrAdmin } from "../middleware/authorization";

const router = Router();

// GET - Listar todos os usuários (apenas admin)
router.get("/", authenticateToken, isAdmin, getAllUsers);

// POST - Criar novo usuário (apenas admin)
router.post("/", authenticateToken, isAdmin, createUser);

// PUT - Atualizar usuário (dono ou admin)
router.put("/:id", authenticateToken, isOwnerOrAdmin(req => Number(req.params.id)), updateUser);

// DELETE - Deletar usuário (dono ou admin)
router.delete("/:id", authenticateToken, isOwnerOrAdmin(req => Number(req.params.id)), deleteUser);

export default router;
