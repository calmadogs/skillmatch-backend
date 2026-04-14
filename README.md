# 🚀 SkillMatch Backend

## 📌 Sobre o projeto

O SkillMatch é uma plataforma que conecta clientes a freelancers, permitindo a criação de projetos e candidatura de profissionais com base em habilidades.

Este repositório contém o backend da aplicação, responsável pela lógica de negócio, autenticação de usuários e gerenciamento de projetos e candidaturas.

---

## 🚀 Tecnologias utilizadas

* Node.js
* TypeScript
* Express
* Prisma ORM
* PostgreSQL
* JWT (Autenticação)

---

## 🎯 Funcionalidades

* Registro e login de usuários
* Autenticação com JWT
* Diferenciação de usuários (CLIENT / FREELA)
* Criação de projetos
* Definição de:

  * orçamento
  * prazo
  * habilidades
* Listagem de projetos
* Sistema de candidatura
* Cancelamento de candidatura
* Proteção de rotas

---

## ⚙️ Como rodar o projeto

```bash
# Clonar o repositório
git clone https://github.com/calmadogs/skillmatch-backend.git

# Entrar na pasta
cd skillmatch-backend

# Instalar dependências
npm install
```

---

## 🔧 Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto com as variáveis:

```env
DATABASE_URL="sua_url_do_banco"
JWT_SECRET="sua_chave_secreta"
PORT=3000
```

---

## 🧱 Banco de dados (Prisma)

```bash
# Rodar migrations
npx prisma migrate dev

# Gerar client
npx prisma generate
```

---

## ▶️ Rodar o servidor

```bash
npm run dev
```

Servidor disponível em:

```
http://localhost:3000
```

---

## 📂 Estrutura do projeto

```
src/
 ├── controllers/     # Regras de negócio
 ├── routes/          # Rotas da API
 ├── middlewares/     # Autenticação e validações
 ├── services/        # Lógica separada (se houver)
 ├── prisma/          # Configuração do banco
 ├── utils/           # Funções auxiliares
 └── server.ts        # Inicialização da aplicação
```

---

## 🔐 Autenticação

A autenticação é feita via JWT.

O token é gerado no login e deve ser enviado no header:

```
Authorization: Bearer TOKEN
```

---

## 📄 Licença

Este projeto é apenas para fins de estudo e portfólio.
