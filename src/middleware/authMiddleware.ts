import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface UserPayload extends JwtPayload {
  userId: number;
  role: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {

  console.log("HEADER RECEBIDO:", req.headers.authorization);

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  try {
    const secret = process.env.JWT_SECRET || "supersecretkey";
    const user = jwt.verify(token, secret) as UserPayload;

    (req as any).user = user;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado, faça login novamente" });
    }
    return res.status(403).json({ error: "Token inválido" });
  }
};
