import { Router } from "express";
import {
  getAllApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// GET - Listar aplicações (permissões tratadas no controller)
router.get("/", authenticateToken, getAllApplications);

// POST - Criar nova aplicação
router.post("/", authenticateToken, createApplication);

// PUT - Atualizar aplicação
router.put("/:id", authenticateToken, updateApplication);

// DELETE - Deletar aplicação
router.delete("/:id", authenticateToken, deleteApplication);

export default router;
