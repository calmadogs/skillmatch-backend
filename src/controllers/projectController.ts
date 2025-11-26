  import { Request, Response } from "express";
  import prisma from "../../prisma/client";

  // GET - Todos os projetos (com filtros e ordenação)
  export const getAllProjects = async (req: Request, res: Response) => {
    const { title, creatorId, skill, minBudget, maxBudget, orderBy } = req.query;

    try {
      const filters: any = {};

      // Filtro por título
      if (title) {
        filters.title = { contains: String(title), mode: "insensitive" };
      }

      // Filtro por criador
      if (creatorId) {
        filters.creatorId = Number(creatorId);
      }

      // Filtro por orçamento
      if (minBudget || maxBudget) {
        filters.budget = {
          gte: minBudget ? Number(minBudget) : undefined,
          lte: maxBudget ? Number(maxBudget) : undefined,
        };
      }

      // Filtro por skill
      if (skill) {
        filters.skills = {
          some: { name: { contains: String(skill), mode: "insensitive" } },
        };
      }

      // Ordenação dinâmica
      let orderByOption: any = { createdAt: "desc" };
      if (orderBy) {
        const [field, direction] = String(orderBy).split(":");
        if (field && ["asc", "desc"].includes(direction)) {
          orderByOption = { [field]: direction };
        }
      }

      const projects = await prisma.project.findMany({
        where: filters,
        include: {
          creator: true,
          skills: true,
          applications: true,
        },
        orderBy: orderByOption,
      });

      if (projects.length === 0) {
        return res.status(404).json({ message: "Nenhum projeto encontrado com esses filtros" });
      }

      res.json(projects);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
      res.status(500).json({ error: "Erro ao buscar projetos" });
    }
  };

  // GET - Obter projeto por ID
  export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id: Number(id) },
      include: { skills: true, creator: true, applications: true },
    });

    if (!project) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }

    res.json(project);
  } catch (error) {
    console.error("Erro ao buscar projeto por ID:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};


  // POST - Criar novo projeto (somente CLIENT)
  export const createProject = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;

      if (user.role !== "CLIENT") {
        return res.status(403).json({ error: "Apenas CLIENT pode criar projetos" });
      }

      const { title, description, budget, deadline, skills } = req.body;

      if (!title || !description || !budget || !deadline) {
        return res.status(400).json({ error: "Preencha todos os campos obrigatórios" });
      }

      // Garante que skills seja um array e remove duplicadas
      let skillsArray: string[] = [];
      if (Array.isArray(skills)) {
        skillsArray = skills;
      } else if (typeof skills === "string" && skills.trim() !== "") {
        skillsArray = [skills.trim()];
      }

      const uniqueSkills = [...new Set(skillsArray.map((s) => s.trim().toLowerCase()))];

      const project = await prisma.project.create({
        data: {
          title,
          description,
          budget: parseFloat(budget),
          deadline: new Date(deadline),
          creatorId: user.userId,
          skills: {
            create: uniqueSkills.map((skill: string) => ({ name: skill })),
          },
        },
        include: { skills: true },
      });

      res.status(201).json({ message: "Projeto criado com sucesso", project });
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      res.status(500).json({ error: "Erro ao criar projeto" });
    }
  };

  // PUT - Atualizar projeto (somente criador)
  export const updateProject = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { id } = req.params;
      const { title, description, budget, deadline, status, skills } = req.body;

      const project = await prisma.project.findUnique({
        where: { id: Number(id) },
        include: { skills: true },
      });

      if (!project) {
        return res.status(404).json({ error: "Projeto não encontrado" });
      }

      if (Number(project.creatorId) !== Number(user.userId)) {
        return res.status(403).json({ error: "Acesso negado: você não é o dono deste projeto" });
      }

      // Garante que skills seja um array
      let skillsArray: string[] = [];
      if (Array.isArray(skills)) {
        skillsArray = skills;
      } else if (typeof skills === "string" && skills.trim() !== "") {
        skillsArray = [skills.trim()];
      }

      // Atualiza o projeto
      const updatedProject = await prisma.project.update({
        where: { id: Number(id) },
        data: {
          title: title ?? project.title,
          description: description ?? project.description,
          budget: budget ? parseFloat(budget) : project.budget,
          deadline: deadline ? new Date(deadline) : project.deadline,
          status: status ?? project.status,
        },
        include: { skills: true },
      });

      // Atualiza as skills, se enviadas
      if (skillsArray.length > 0) {
        const prismaAny = prisma as any;
        const skillModel =
          prismaAny.skill ||
          prismaAny.Skill ||
          prismaAny.projectSkill ||
          prismaAny.ProjectSkill;

        if (skillModel) {
          await skillModel.deleteMany({ where: { projectId: Number(id) } });

          const uniqueSkills = [...new Set(skillsArray.map((s) => s.trim().toLowerCase()))];

          await skillModel.createMany({
            data: uniqueSkills.map((name: string) => ({
              name,
              projectId: Number(id),
            })),
          });
        } else {
          console.warn("Nenhum modelo de Skill encontrado no Prisma. Verifique o schema.prisma");
        }
      }

      const refreshedProject = await prisma.project.findUnique({
        where: { id: Number(id) },
        include: { skills: true },
      });

      return res.json({
        message: "Projeto atualizado com sucesso",
        project: refreshedProject,
      });
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      return res.status(500).json({ error: "Erro ao atualizar projeto" });
    }
  };

  // DELETE - Deletar projeto (somente criador)
  export const deleteProject = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      const project = await prisma.project.findUnique({ where: { id: Number(id) } });
      if (!project) {
        return res.status(404).json({ error: "Projeto não encontrado" });
      }

      if (Number(project.creatorId) !== Number(user.userId)) {
        return res.status(403).json({ error: "Acesso negado: você não é o dono deste projeto" });
      }

      await prisma.project.delete({ where: { id: Number(id) } });
      res.json({ message: "Projeto deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar projeto:", error);
      res.status(500).json({ error: "Erro ao deletar projeto" });
    }
  };
