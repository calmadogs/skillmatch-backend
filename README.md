# SkillMatch Backend

API construída com Node.js, Express e Prisma.

## Como rodar o projeto

npm install
npm run dev

## Tecnologias
- Node.js
- Express
- Prisma ORM
- SQLite
- JWT (autenticação)
- Bcrypt (hash de senhas)

## Estrutura de Pastas
src/
├── controllers/
├── routes/
├── middleware/
├── prisma/
├── utils/
└── index.ts

## Autenticação
- Registro e login com JWT.
- Middleware protege rotas autenticadas.
- Níveis de acesso: CLIENT, FREELANCER e ADMIN.

## Autor
Desenvolvido por @calmadogs

