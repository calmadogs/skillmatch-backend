
import { Prisma } from "@prisma/client";

export const handlePrismaError = (error: unknown): string => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return "Registro duplicado: o dado informado já existe.";
      case "P2025":
        return "Registro não encontrado.";
      case "P2003":
        return "Violação de chave estrangeira.";
      default:
        return `Erro no banco de dados (código: ${error.code}).`;
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return "Erro de validação dos dados enviados ao banco.";
  }

  return "Erro interno do servidor.";
};
