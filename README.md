# SkillMatch Backend

API desenvolvida para gerenciar usuários, projetos e candidaturas em uma plataforma de conexão entre **clientes** e **freelancers**, permitindo criação de projetos, candidaturas, autenticação via JWT e controle de acesso baseado em papéis (roles).

---

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **Express**
- **Prisma ORM**
- **SQLite / PostgreSQL**
- **JWT (JSON Web Token)** – autenticação
- **BcryptJS** – hash de senhas
- **TypeScript**
- **Dotenv**
- **Cors**

---

```markdown
## 📂 Estrutura de Pastas

```plaintext
src/
├── controllers/ # Regras de negócio e lógica das rotas
│   ├── authController.ts
│   ├── userController.ts
│   ├── projectController.ts
│   └── applicationController.ts
│
├── routes/ # Definição das rotas
│   ├── authRoutes.ts
│   ├── userRoutes.ts
│   ├── projectRoutes.ts
│   └── applicationRoutes.ts
│
├── middleware/ # Autenticação e autorização
│   ├── authMiddleware.ts
│   └── authorization.ts
│
├── prisma/ # Configuração do Prisma ORM e schema
│   └── schema.prisma
│
├── utils/ # Funções auxiliares (hash, validações, erros)
│   ├── hashUtils.ts
│   ├── generateToken.ts
│   ├── handleError.ts
│   └── validateEmail.ts
│
└── index.ts # Ponto de entrada do servidor

---

## ⚙️ Como Rodar o Projeto Localmente

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/calmadogs/skillmatch-backend.git

2️⃣ Acessar a pasta do projeto
bash
Copiar código
cd skillmatch-backend

3️⃣ Instalar dependências
bash
Copiar código
npm install

4️⃣ Criar e configurar o arquivo .env
env
Copiar código
DATABASE_URL="file:./dev.db"
JWT_SECRET="supersecretkey"
PORT=3000
💡 Caso utilize PostgreSQL:
ini
Copiar código
DATABASE_URL="postgresql://usuario:senha@localhost:5432/skillmatch"

5️⃣ Gerar o banco de dados Prisma
bash
Copiar código
npx prisma migrate dev --name init

6️⃣ Rodar em modo de desenvolvimento
bash
Copiar código
npm run dev

7️⃣ Rodar em produção
bash
Copiar código
npm run build
npm start
Servidor disponível em:

arduino
Copiar código
http://localhost:3000

--- 

🔐 Autenticação e Autorização
O sistema utiliza JWT (JSON Web Token) para autenticar usuários e proteger rotas privadas.

Papéis disponíveis:
ADMIN → acesso total ao sistema

CLIENT → cria e gerencia seus próprios projetos

FREELANCER → visualiza projetos e envia candidaturas

Fluxo:
Registro → /auth/register

Login → /auth/login

Recebe o token JWT

Envia o token no cabeçalho das requisições:

makefile
Copiar código
Authorization: Bearer seu_token_aqui

--- 

🧠 Funcionalidades Principais
 
👤 Usuários (/users)
Criar usuários (apenas ADMIN)

Atualizar perfil do próprio usuário

Excluir conta

Listar todos os usuários (apenas ADMIN)

💼 Projetos (/projects)
Criar projeto (somente CLIENT)

Atualizar e deletar projeto (somente o criador)

Listar e filtrar projetos por:

título

criador

orçamento mínimo/máximo

skills

ordenação dinâmica

📝 Candidaturas (/applications)
Freelancer se candidata a um projeto

Cliente aceita ou rejeita candidaturas

Status dinâmico:

pendente

aceita

recusada

---

🧪 Testes de API
Você pode testar todas as rotas usando Insomnia ou Postman.

Principais rotas:
🔑 Autenticação
Método	Rota	Descrição
POST	/auth/register	Registrar novo usuário
POST	/auth/login	Login e geração de token

👤 Usuários
Método	Rota	Descrição
GET	/users	Listar todos os usuários (ADMIN)
PUT	/users/:id	Atualizar dados de usuário
DELETE	/users/:id	Excluir usuário

💼 Projetos
Método	Rota	Descrição
GET	/projects	Listar todos os projetos
POST	/projects	Criar novo projeto
PUT	/projects/:id	Atualizar projeto
DELETE	/projects/:id	Deletar projeto

📝 Candidaturas
Método	Rota	Descrição
POST	/applications	Criar nova candidatura
PUT	/applications/:id	Atualizar status
DELETE	/applications/:id	Remover candidatura

----

🧾 Variáveis de Ambiente (.env)
Variável	Descrição	Exemplo
DATABASE_URL	Caminho do banco de dados	file:./dev.db
JWT_SECRET	Chave usada para gerar tokens JWT	supersecretkey
PORT	Porta do servidor	3000

----

🧰 Scripts Disponíveis
Script	Descrição
npm run dev	Inicia o servidor em modo desenvolvimento
npm run build	Compila o TypeScript
npm start	Executa o servidor compilado
npx prisma studio	Abre o painel visual do Prisma

--- 

📘 Exemplo de Registro
json
Copiar código
POST /auth/register
{
  "name": "Tiago Rodrigues",
  "email": "tiago@email.com",
  "password": "123456",
  "role": "CLIENT"
}

---

📘 Exemplo de Login
json
Copiar código
POST /auth/login
{
  "email": "tiago@email.com",
  "password": "123456"
}

---

🧱 Tratamento de Erros
Erros centralizados no utilitário handleError.ts

Validação de e-mails com validateEmail.ts

Respostas padronizadas de erro em JSON:

json
Copiar código
{ "error": "Mensagem de erro descritiva" }

---

✨ Autor
Desenvolvido por @calmadogs
Projeto criado para fins de estudo e portfólio, com foco em boas práticas de backend moderno usando Node.js + Prisma + TypeScript.


