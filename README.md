# funcode

> An AI-powered website builder based on the FunCode tutorial — scaffold, generate and deploy full-stack apps from a short prompt.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build status](https://img.shields.io/badge/build-passing-brightgreen.svg)]

## About

This repository contains the code built while following the **FunCode** tutorial "Build and Deploy a SaaS AI Website Builder". The project demonstrates how to connect an LLM (e.g. Anthropic Claude), background job orchestration, and a modern Next.js frontend to generate and deploy small full‑stack apps from natural-language prompts.

> The README has been tailored to reflect the features and stack used in the tutorial — update any commands, env names, or scripts to match your actual repository files.

## Features

* Prompt → generated full-stack app scaffold (frontend + backend)
* Background job orchestration for long-running generation tasks
* Saves generated apps and metadata to a database
* Deploy-ready output (Vercel-ready by default)
* Authentication + user accounts (Clerk) and billing hooks (E2B) examples

## Tech Stack

* Next.js (app-router)
* TypeScript
* Anthropic (Claude) as the LLM
* Inngest for background job orchestration
* Prisma (database ORM)
* Clerk for authentication (optional)
* E2B (example billing/webhook integration)
* tRPC (if present in the repo) and REST endpoints
* Tailwind CSS / shadcn/ui for UI components

## Getting Started

### Prerequisites

* Node.js (>= 18)
* npm / pnpm / yarn
* A database (Postgres / Neon / Supabase) and a connection URL
* Anthropic API key (or another LLM provider key)
* Clerk keys if you want authentication features

### Install

```bash
# clone the repo
git clone https://github.com/Shubham-kr-chaudhary/funcode.git
cd funcode

# install dependencies
npm install
# or
# pnpm install
# or
# yarn install
```

### Environment Variables

Create a `.env` file in the project root and add the variables the app expects. Example names below — adapt to match your code:

```
DATABASE_URL=

NEXT_PUBLIC_APP_URL=

#OPEN AI
OPENAI_API_KEY=

# E2B
E2B_API_KEY=

#Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=

```

### Run Locally

```bash
# development
npm run dev
# or
pnpm dev
# build
npm run build
# start
npm run start
```

## Usage

1. Start the app locally (`npm run dev`).
2. Open the UI and sign in (if auth is configured).
3. Enter a short prompt describing the app you want generated and submit.
4. The app generation will run as a background job — monitor progress in the UI or the job dashboard.
5. When finished, the generated project link (or preview) will be available; you can download or deploy it.

## Testing

Run unit and integration tests (adjust to your test runner):

```bash
npm test
# or
npm run test:watch
```

## Linting & Formatting

```bash
npm run lint
npm run format
```

## Deployment

**Vercel** is the recommended host for a Next.js app. Configure the same environment variables in the Vercel dashboard and push to your Git remote. Example steps:

1. Create a Vercel project and connect your GitHub repository.
2. Add environment variables in the Vercel project settings.
3. Push to `main` (or the branch you configured).

**Docker (optional)**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "dist/index.js"]
```

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Contact

Shubham Chaudhary — update this with your email or preferred contact.

Project Link: [https://github.com/Shubham-kr-chaudhary/funcode](https://github.com/Shubham-kr-chaudhary/funcode)

## Acknowledgements

* FunCode — the tutorial used to build this project
* Anthropic, Inngest, Prisma, Clerk, and Vercel for the integrations shown in the tutorial

---
