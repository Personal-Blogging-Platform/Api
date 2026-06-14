# Personal Blogging Platform API 🚀

A robust, scalable, and secure RESTful API built to power a personal blogging platform. Designed with enterprise-grade system architecture, this backend emphasizes security, data validation, and clean separation of concerns.

## ✨ Key Features
* **Modern Architecture:** Built with Node.js, TypeScript (ES2022 Modules), and native subpath imports (`#/*`) for clean dependency resolution.
* **Fail-Fast Configuration:** Strict runtime environment variable validation using **Zod**. If a critical secret is missing, the server refuses to boot, preventing downstream production errors.
* **Advanced Security Layer:**
  * **Helmet** for HTTP header security.
  * **Express Rate Limit** to prevent brute-force and DDoS attacks.
  * Modern payload sanitization using `express-mongo-sanitize` and `express-xss-sanitizer`.
  * Dynamic CORS configuration ready for reverse-proxy integration.
* **Centralized Error Handling:** Custom `OperationalError` classes and async wrappers intercept all Mongoose, JWT, and Zod exceptions, formatting them cleanly without leaking stack traces in production.
* **DevOps Ready:** Fully containerized MongoDB local environment via Docker Compose, and server logic configured with Graceful Shutdown handlers (`SIGTERM`, `unhandledRejection`) for seamless cloud deployments.

## 🛠️ Tech Stack
* **Runtime:** Node.js, TypeScript (`tsx` for execution)
* **Framework:** Express.js 5.x
* **Database:** MongoDB (Mongoose ORM)
* **Validation:** Zod
* **Authentication:** JSON Web Tokens (JWT) & bcrypt
* **Infrastructure:** Docker & Docker Compose

## 🚀 Quick Start / Local Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v20+ recommended)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 1. Clone & Install
```bash
git clone [https://github.com/Personal-Blogging-Platform/Api.git](https://github.com/Personal-Blogging-Platform/Api.git)
cd Api
npm install
```

### 2. Configure Environment

Read the comprehensive environment setup guide and apply your local configurations: 👉 [Environment Variables Guide](docs/ENVIRONMENTAL_VARS.md)

### 3. Spin Up the Database

Start the containerized MongoDB instance in the background:

```bash
docker-compose up -d
```

### 4. Start the Development Server

```bash
npm run dev
```

The server will boot with a custom ANSI logger and listen on `http://localhost:4000`.

## 📡 API Endpoints Overview

| Method | Endpoint | Protection | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/health` | Public | System health check and uptime status. | Done |
| **POST** | `/api/auth/register` | Public | Register a new user account. | Not Done Yet |
| **POST** | `/api/auth/login` | Public | Authenticate and receive a JWT. | Not Done Yet |
| **GET** | `/api/posts` | Public | Retrieve all blog posts. | Not Done Yet |
| **POST** | `/api/posts` | Private | Create a new blog post. | Not Done Yet |
| **PUT** | `/api/posts/:id` | Private | Update an existing post (Owner only). | Not Done Yet |
| **DELETE** | `/api/posts/:id` | Private | Delete a post (Owner only). | Not Done Yet |

## 📂 Project Structure

```
├── docs/                   # Architectural documentation & env specs
├── src/
│   ├── config/             # Zod environment validation & DB connection
│   ├── controllers/        # HTTP request/response handlers
│   ├── middlewares/        # Security, auth, and global error handlers
│   ├── models/             # Mongoose schemas & Types
│   ├── routes/             # Express router definitions
│   ├── services/           # Core business logic
│   ├── utils/              # Custom loggers, async handlers, error classes
│   ├── app.ts              # Express initialization & security middleware
│   └── server.ts           # Server bootstrapping & process listeners
├── docker-compose.yml      # MongoDB container orchestration
└── package.json            # Scripts & dependencies
```
Developed with a focus on system-level thinking and modern API standards.
