import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { hashPassword } from "../utils/hashPassword";

// GET - Todos usuários (somente admin)
export const getAllUsers = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user.role !== "ADMIN") return res.status(403).json({ error: "Acesso negado" });

  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

// POST - Criar novo usuário (apenas admin)
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role, bio } = req.body;
  try {
    if (!name || !email || !password || !role)
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "E-mail já está em uso" });

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role, bio },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
};

// PUT - Atualizar usuário (dono ou admin)
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, role, bio } = req.body;
  const loggedUser = (req as any).user;
  const userId = Number(id);

  if (loggedUser.userId !== userId && loggedUser.role !== "ADMIN")
    return res.status(403).json({ error: "Acesso negado" });

  try {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) return res.status(404).json({ error: "Usuário não encontrado" });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        password: password ? await hashPassword(password) : existingUser.password,
        role: loggedUser.role === "ADMIN" ? role : existingUser.role,
        bio,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
};

// DELETE - Usuário ou admin
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const loggedUser = (req as any).user;
  const userId = Number(id);

  if (loggedUser.userId !== userId && loggedUser.role !== "ADMIN")
    return res.status(403).json({ error: "Acesso negado" });

  try {
    await prisma.application.deleteMany({ where: { freelancerId: userId } });
    const userProjects = await prisma.project.findMany({
      where: { creatorId: userId },
      select: { id: true },
    });
    await prisma.application.deleteMany({ where: { projectId: { in: userProjects.map(p => p.id) } } });
    await prisma.userSkill.deleteMany({ where: { userId } });
    await prisma.project.deleteMany({ where: { creatorId: userId } });
    await prisma.user.delete({ where: { id: userId } });

    res.json({ message: "Usuário e registros relacionados deletados com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
};
