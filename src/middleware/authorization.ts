import { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Acesso negado: apenas administradores" });
  }
  next();
};

export const isOwnerOrAdmin = (getOwnerId: (req: Request) => number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const ownerId = getOwnerId(req);

    if (!user || (user.userId !== ownerId && user.role !== "ADMIN")) {
      return res.status(403).json({ success: false, message: "Acesso negado" });
    }
    next();
  };
};
