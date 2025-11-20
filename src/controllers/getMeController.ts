  import { Request, Response } from "express";
  import prisma from "../../prisma/client";

  export const getMe = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true }
      });

      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao carregar dados do usuário" });
    }
  };
