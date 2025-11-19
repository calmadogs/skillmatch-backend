import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes";
import projectRoutes from "./routes/projectRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import authRoutes from "./routes/authRoutes";
import getMeRoutes from "./routes/getMeRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas públicas (sem token)
app.use("/auth", authRoutes);

// Rotas protegidas (com token)
app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/applications", applicationRoutes);

// GET /me
app.use("/me", getMeRoutes);

// Rota de teste
app.get("/", (req, res) => res.send("SkillMatch Backend rodando!"));

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
