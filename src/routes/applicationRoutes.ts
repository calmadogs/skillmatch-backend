import { Router } from "express";
import {
  getAllApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController";
import { authenticateToken } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/authorization";

const router = Router();

// GET - Todas as aplicações (somente admin)
router.get("/", authenticateToken, isAdmin, getAllApplications);

// POST - Criar nova aplicação (qualquer usuário logado)
router.post("/", authenticateToken, createApplication);

// PUT - Atualizar aplicação (dono ou admin)
router.put("/:id", authenticateToken, updateApplication);

// DELETE - Deletar aplicação (dono ou admin)
router.delete("/:id", authenticateToken, deleteApplication);

export default router;
