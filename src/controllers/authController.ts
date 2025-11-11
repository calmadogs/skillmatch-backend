import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client";
import { validateEmail } from "../utils/validateEmail";
import { handlePrismaError } from "../utils/handlePrismaError"; 

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// POST - Registrar novo usuário
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "E-mail inválido" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return res.status(201).json({
      message: "Usuário registrado com sucesso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // Trata erros específicos do Prisma (violação de unicidade, etc.)
    const handled = handlePrismaError(error);
    if (handled) {
      return res.status(handled.status).json({ error: handled.message });
    }

    console.error(error);
    return res.status(500).json({ error: "Erro ao registrar usuário" });
  }
};

// POST - Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({
      message: "Login bem-sucedido",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    const handled = handlePrismaError(error);
    if (handled) {
      return res.status(handled.status).json({ error: handled.message });
    }

    console.error(error);
    return res.status(500).json({ error: "Erro ao fazer login" });
  }
};
