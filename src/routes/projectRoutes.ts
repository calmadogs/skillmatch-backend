import { Router } from "express";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// GET - Listar todos os projetos
router.get("/", authenticateToken, getAllProjects);

// POST - Criar novo projeto (CLIENT)
router.post("/", authenticateToken, createProject);

// PUT - Atualizar projeto (validação no controller)
router.put("/:id", authenticateToken, updateProject);

// DELETE - Deletar projeto (validação no controller)
router.delete("/:id", authenticateToken, deleteProject);

export default router;
