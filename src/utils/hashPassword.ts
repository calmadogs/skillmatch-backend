import bcrypt from "bcryptjs";


// Gera um hash seguro para a senha

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};


// Compara uma senha em texto puro com o hash armazenado

export const comparePassword = async (password: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(password, hashed);
};
