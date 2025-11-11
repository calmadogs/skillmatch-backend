import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";


// Gera um token JWT com ID e role do usuário

export const generateToken = (userId: number, role: string): string => {
  const payload = { userId, role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};
