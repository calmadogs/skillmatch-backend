import { Request, Response } from "express";
import prisma from "../../prisma/client";

// GET - Listar aplicações
export const getAllApplications = async (req: Request, res: Response) => {
  const loggedUser = (req as any).user;
  const { freelancerId, projectId, status } = req.query;

  try {
    // ADMIN pode listar tudo com filtros
    if (loggedUser.role === "ADMIN") {
      const filters: any = {};
      if (freelancerId) filters.freelancerId = Number(freelancerId);
      if (projectId) filters.projectId = Number(projectId);
      if (status) filters.status = String(status);

      const apps = await prisma.application.findMany({
        where: filters,
        include: { freelancer: true, project: true },
      });
      return res.json({ success: true, data: apps });
    }

    // FREELA pode ver apenas suas próprias aplicações
    if (loggedUser.role === "FREELA") {
      const apps = await prisma.application.findMany({
        where: {
          freelancerId: loggedUser.userId,
          ...(status ? { status: String(status) } : {}),
        },
        include: { freelancer: true, project: true },
      });
      return res.json({ success: true, data: apps });
    }

    // CLIENTE pode ver aplicações dos projetos que ele criou
    if (loggedUser.role === "CLIENTE") {
      const userProjects = await prisma.project.findMany({
        where: { creatorId: loggedUser.userId },
        select: { id: true },
      });

      const projectIds = userProjects.map((p) => p.id);
      if (projectIds.length === 0)
        return res.json({ success: true, data: [] });

      const apps = await prisma.application.findMany({
        where: {
          projectId: { in: projectIds },
          ...(status ? { status: String(status) } : {}),
        },
        include: { freelancer: true, project: true },
      });

      return res.json({ success: true, data: apps });
    }

    res.status(403).json({ error: "Acesso negado" });
  } catch (error) {
    console.error("Erro ao buscar aplicações:", error);
    res.status(500).json({ error: "Erro interno ao buscar aplicações" });
  }
};

// POST - Criar aplicação
export const createApplication = async (req: Request, res: Response) => {
  const { freelancerId, projectId, status } = req.body;
  const loggedUser = (req as any).user;

  try {
    if (loggedUser.userId !== freelancerId && loggedUser.role !== "ADMIN")
      return res.status(403).json({ error: "Acesso negado" });

    const freelancer = await prisma.user.findUnique({
      where: { id: Number(freelancerId) },
    });
    if (!freelancer)
      return res.status(404).json({ error: "Freelancer não encontrado" });

    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
    });
    if (!project)
      return res.status(404).json({ error: "Projeto não encontrado" });

    const existingApp = await prisma.application.findFirst({
      where: {
        freelancerId: Number(freelancerId),
        projectId: Number(projectId),
      },
    });
    if (existingApp)
      return res
        .status(400)
        .json({ error: "Você já se aplicou para este projeto" });

    const app = await prisma.application.create({
      data: {
        freelancerId: Number(freelancerId),
        projectId: Number(projectId),
        status: status && status.trim() !== "" ? status : "PENDING",
      },
      include: { freelancer: true, project: true },
    });

    res.status(201).json({
      success: true,
      message: "Aplicação criada com sucesso",
      data: app,
    });
  } catch (error: any) {
    console.error("Erro ao criar aplicação:", error);
    if (error.code === "P2003")
      return res
        .status(400)
        .json({ error: "Freelancer ou projeto inválido" });
    res.status(500).json({ error: "Erro interno ao criar aplicação" });
  }
};

// PUT - Atualizar status da aplicação
export const updateApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const loggedUser = (req as any).user;

  try {
    if (!status)
      return res.status(400).json({ error: "Status é obrigatório" });

    const validStatuses = ["PENDING", "APPROVED", "REJECTED"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ error: "Status inválido" });

    const app = await prisma.application.findUnique({
      where: { id: Number(id) },
      include: { project: true },
    });

    if (!app)
      return res.status(404).json({ error: "Aplicação não encontrada" });

    if (
      app.project.creatorId !== loggedUser.userId &&
      loggedUser.role !== "ADMIN"
    ) {
      return res.status(403).json({
        error:
          "Acesso negado: apenas o cliente dono do projeto ou admin pode atualizar o status",
      });
    }

    const updatedApp = await prisma.application.update({
      where: { id: Number(id) },
      data: { status },
      include: { freelancer: true, project: true },
    });

    res.json({
      success: true,
      message: "Status atualizado com sucesso",
      data: updatedApp,
    });
  } catch (error) {
    console.error("Erro ao atualizar aplicação:", error);
    res.status(500).json({ error: "Erro interno ao atualizar aplicação" });
  }
};

// DELETE - Deletar aplicação
export const deleteApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const loggedUser = (req as any).user;

  try {
    const app = await prisma.application.findUnique({
      where: { id: Number(id) },
    });
    if (!app)
      return res.status(404).json({ error: "Aplicação não encontrada" });

    if (app.freelancerId !== loggedUser.userId && loggedUser.role !== "ADMIN")
      return res.status(403).json({ error: "Acesso negado" });

    await prisma.application.delete({ where: { id: Number(id) } });

    res.json({ success: true, message: "Aplicação deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar aplicação:", error);
    res.status(500).json({ error: "Erro interno ao deletar aplicação" });
  }
};
