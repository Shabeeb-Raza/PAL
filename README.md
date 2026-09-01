# PAL Portal - Student Advisory System

Data-driven academic advisory system for CS students at IOBM.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Deployment**: Vercel (frontend + API)
- **ML Service**: Python microservice (Hugging Face Spaces)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages & API routes
│   └── api/          # API endpoints
├── components/       # React components
│   └── ui/          # Reusable UI components
├── lib/             # Utility functions & business logic
├── types/           # TypeScript type definitions
└── config/          # Configuration constants

data/
└── seed/            # Seed data for development

docs/
└── adr/             # Architecture Decision Records
```

## Architecture

See [SPEC.md](./SPEC.md) for full specification.
See [CONTEXT.md](./CONTEXT.md) for domain vocabulary.

## Environment Variables

Create `.env.local`:

```env
# Database (when MySQL access is available)
DATABASE_URL="mysql://..."

# OpenAI (for LLM chatbot - Phase 2)
OPENAI_API_KEY="sk-..."
```
