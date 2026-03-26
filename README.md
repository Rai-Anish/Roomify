# Roomify — AI Floor Plan Visualizer

> Transform 2D floor plans into photorealistic 3D architectural renders using AI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-20.x-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![React](https://img.shields.io/badge/React-19.x-61DAFB.svg)
![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748.svg)

---

## Overview

Roomify is a full-stack web application that uses AI to convert 2D architectural floor plans into photorealistic top-down 3D renders. Users upload a floor plan image and receive a professional visualization with realistic materials, furniture, and lighting — in seconds.

**Two AI rendering providers are supported:**

- **ComfyUI** — runs locally on your GPU using FLUX.2-klein. Free, no API limits.
- **Gemini AI** — Google's cloud-based image generation. No GPU required.

---

## Features

- Upload 2D floor plan images (JPG, PNG, WebP, SVG)
- AI-powered photorealistic render generation
- Choose between ComfyUI (local GPU) or Gemini AI (cloud)
- Private and community project visibility
- Google OAuth sign-in
- Email verification via Resend
- JWT authentication with automatic token refresh
- User profile management with avatar upload
- Community gallery of shared projects
- Fully responsive UI

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React Router v7 | SPA framework with file-based routing |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| TanStack Query | Server state management & caching |
| Zustand | Client state management |
| Axios | HTTP client with interceptors |
| Sonner | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| TypeScript | Type safety |
| Prisma ORM v7 | Database access |
| PostgreSQL | Primary database |
| JWT | Authentication (access + refresh tokens) |
| bcryptjs | Password hashing |
| Multer | File upload handling |
| Cloudinary | Image storage |
| Resend | Transactional emails |
| google-auth-library | Google OAuth token verification |
| Zod | Request validation |

### AI & Rendering
| Technology | Purpose |
|---|---|
| ComfyUI | Local GPU-based rendering (FLUX.2-klein) |
| Google Gemini API | Cloud-based AI image generation |
| FLUX.2-klein-base-4b-fp8 | Diffusion model |
| qwen_3_4b | CLIP text encoder |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker + Docker Compose | Containerized development |
| Cloudinary | Image CDN and storage |

---

## Project Structure

```
roomify/
├── client/                          # React Router 7 frontend
│   ├── app/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── NavDropdown.tsx
│   │   │   ├── NavMobile.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectSettingsModal.tsx
│   │   │   ├── GoogleButton.tsx
│   │   │   └── Upload.tsx
│   │   ├── hooks/                   # React Query hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useProject.ts
│   │   │   └── useUser.ts
│   │   ├── routes/                  # Page components
│   │   │   ├── home.tsx
│   │   │   ├── my-projects.tsx
│   │   │   ├── profile.tsx
│   │   │   ├── pricing.tsx
│   │   │   ├── enterprise.tsx
│   │   │   ├── privacy.tsx
│   │   │   ├── terms.tsx
│   │   │   ├── cookies.tsx
│   │   │   ├── visualizer.$id.tsx
│   │   │   └── auth/
│   │   │       ├── login.tsx
│   │   │       ├── signup.tsx
│   │   │       ├── verify.tsx
│   │   │       └── auth.callback.tsx
│   │   ├── store/
│   │   │   └── authStore.ts         # Zustand auth store
│   │   ├── lib/
│   │   │   ├── axios.ts             # Axios instance + interceptors
│   │   │   └── queryClient.ts       # TanStack Query client
│   │   └── types/
│   │       └── index.ts
│   └── package.json
│
├── server/                          # Express + TypeScript backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts                # Prisma client
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── project.controller.ts
│   │   │   ├── oauth.controller.ts
│   │   │   └── user.controller.ts
│   │   ├── jobs/
│   │   │   └── project.processor.ts # Async render processing
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── authorize.middleware.ts
│   │   │   ├── validate.middleware.ts
│   │   │   ├── upload.middleware.ts
│   │   │   └── errorHandler.middleware.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── project.routes.ts
│   │   │   └── user.routes.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── project.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── gemini.service.ts
│   │   │   ├── oauth.service.ts
│   │   │   └── comfyui/             # ComfyUI integration
│   │   │       ├── index.ts
│   │   │       ├── client.ts
│   │   │       ├── workflow.ts
│   │   │       ├── poller.ts
│   │   │       └── types.ts
│   │   ├── types/
│   │   │   ├── auth.types.ts
│   │   │   ├── project.types.ts
│   │   │   └── user.types.ts
│   │   └── utils/
│   │       ├── ApiError.ts
│   │       ├── ApiResponse.ts
│   │       ├── asyncHandler.ts
│   │       ├── jwt.utils.ts
│   │       ├── token.utils.ts
│   │       ├── email.utils.ts
│   │       └── cloudinary.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── prisma.config.ts
│   └── package.json
│
├── docker-compose.yml
├── docker-compose.dev.yml
└── .env.example
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker + Docker Compose
- NVIDIA GPU with 8GB+ VRAM (for ComfyUI)
- ComfyUI installed locally (for local rendering)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/roomify.git
cd roomify
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in all required values (see [Environment Variables](#environment-variables)).

### 3. Set up ComfyUI models

Download the following models into your ComfyUI installation:

| Model | Path |
|---|---|
| `flux-2-klein-base-4b-fp8.safetensors` | `models/diffusion_models/` |
| `qwen_3_4b.safetensors` | `models/text_encoders/` |
| `flux2-vae.safetensors` | `models/vae/` |

Start ComfyUI:
```bash
python main.py --listen 0.0.0.0 --port 8188
```

### 4. Start the development environment

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 5. Run database migrations

```bash
docker-compose -f docker-compose.dev.yml exec server npx prisma migrate dev
```

### 6. Open the app

| Service | URL |
|---|---|
| Client | http://localhost:5173 |
| Server API | http://localhost:5000 |
| Prisma Studio | http://localhost:5555 |
| ComfyUI | http://localhost:8188 |

---

## Environment Variables

Create a `.env` file in the root directory. See `.env.example` for all variables.

```env
# Database
POSTGRES_USER=roomify
POSTGRES_PASSWORD=password
POSTGRES_DB=roomify_db
DATABASE_URL=postgresql://roomify:password@db:5432/roomify_db

# JWT
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email (Resend)
RESEND_API_KEY=
FROM_EMAIL=onboarding@resend.dev

# Client
CLIENT_URL=http://localhost:5173
VITE_SERVER_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# AI Providers
GEMINI_API_KEY=
COMFYUI_URL=http://host.docker.internal:8188
```

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Register new user |
| `POST` | `/api/auth/login` | — | Login |
| `GET` | `/api/auth/verify-email` | — | Verify email token |
| `POST` | `/api/auth/resend-verification` | — | Resend verification email |
| `POST` | `/api/auth/refresh` | Cookie | Refresh access token |
| `POST` | `/api/auth/logout` | — | Logout |
| `GET` | `/api/auth/me` | Bearer | Get current user |
| `GET` | `/api/auth/google` | — | Google OAuth redirect |
| `GET` | `/api/auth/google/callback` | — | Google OAuth callback |
| `POST` | `/api/auth/google/token` | — | Google GSI token verify |

### Projects

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/projects/community` | — | Get community projects |
| `GET` | `/api/projects/my` | Bearer | Get my projects |
| `GET` | `/api/projects/:id` | Optional | Get project by ID |
| `POST` | `/api/projects` | Bearer | Create project + render |
| `PUT` | `/api/projects/:id` | Bearer | Update project |
| `DELETE` | `/api/projects/:id` | Bearer | Delete project |

### User

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/user/me` | Bearer | Get profile + stats |
| `PUT` | `/api/user/me` | Bearer | Update profile + avatar |
| `PUT` | `/api/user/me/password` | Bearer | Change password |
| `DELETE` | `/api/user/me` | Bearer | Delete account |

---

## How Rendering Works

```
User uploads floor plan
        ↓
Server saves project (imageUrl: "")
        ↓
Background job starts (non-blocking)
        ↓
┌─────────────────────┐    ┌────────────────────────┐
│   ComfyUI Provider  │ OR │   Gemini AI Provider    │
│                     │    │                         │
│ 1. Upload image to  │    │ 1. Convert to base64    │
│    ComfyUI /upload  │    │ 2. Send to Gemini API   │
│ 2. Queue workflow   │    │ 3. Extract image from   │
│ 3. Poll /history    │    │    response             │
│ 4. Fetch result     │    └────────────────────────┘
└─────────────────────┘
        ↓
Upload render to Cloudinary
        ↓
Update project.imageUrl in DB
        ↓
Frontend polls GET /api/projects/:id every 3s
        ↓
Render appears when imageUrl is set
```

---

## ComfyUI Workflow

The project uses the **FLUX.2-klein image edit workflow** which takes a reference image (the floor plan) and generates a photorealistic architectural render.

**Workflow nodes used:**
- `UNETLoader` — loads FLUX.2-klein diffusion model
- `CLIPLoader` — loads Qwen 3 4B text encoder
- `VAELoader` — loads FLUX2 VAE
- `VAEEncode` → `ReferenceLatent` — encodes floor plan as reference
- `CLIPTextEncode` — encodes architectural prompt
- `CFGGuider` + `SamplerCustomAdvanced` — sampling pipeline
- `VAEDecode` → `SaveImage` — decodes and saves output

**Recommended GPU:** RTX 3060 or higher (8GB+ VRAM)

---

## Authentication Flow

### Email/Password
```
Register → Email verification → Login → Access token (15m) + Refresh token cookie (7d)
```

### Google OAuth (GSI)
```
Click Google button → Google popup → ID token → POST /api/auth/google/token → JWT
```

### Token Refresh
```
Access token expires → Axios interceptor catches 401 → POST /auth/refresh (cookie) → New token → Retry request
```

---

## Docker Setup

### Development
```bash
# start all services with hot reload
docker-compose -f docker-compose.dev.yml up -d

# view logs
docker-compose -f docker-compose.dev.yml logs -f server

# run migrations
docker-compose -f docker-compose.dev.yml exec server npx prisma migrate dev --name your_migration

# open prisma studio
docker-compose -f docker-compose.dev.yml exec server npx prisma studio
```

### Production
```bash
docker-compose up -d
```

---

## Contributing

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m "feat: add your feature"`
4. Push to the branch — `git push origin feature/your-feature`
5. Open a Pull Request

Please follow [Conventional Commits](https://conventionalcommits.org) for commit messages.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Acknowledgements

- [ComfyUI](https://github.com/comfyanonymous/ComfyUI) — local AI inference
- [FLUX.2-klein](https://huggingface.co/black-forest-labs) — diffusion model by Black Forest Labs
- [Google Gemini](https://ai.google.dev) — cloud AI image generation
- [Prisma](https://prisma.io) — next-generation ORM
- [TanStack Query](https://tanstack.com/query) — powerful data fetching

---

<p align="center">Built by Anish Rai</p>
