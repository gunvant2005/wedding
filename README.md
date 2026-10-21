# Gatherly - GenAI Event Planning Assistant

Plan **weddings**, **birthdays**, and **community events** with automated budgets, drag-and-drop timelines, vendor checklists, and a context-aware AI copilot.

---

## Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | React Server Components, Server Actions, Route Handlers |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strict static typing across database, API routes, and components |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first styling with native CSS variables |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) + [Lucide React](https://lucide.dev/) | Accessible primitives, dialogs, dropdowns, and icon library |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) | Toast notification system |
| **Database** | [Neon Postgres](https://neon.tech/) | Serverless PostgreSQL via `@neondatabase/serverless` |
| **ORM & Migrations** | [Drizzle ORM](https://orm.drizzle.team/) + [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) | Type-safe schema definition, migrations, and queries |
| **Authentication** | [Better Auth](https://www.better-auth.com/) | Email & password credentials authentication with Neon integration |
| **AI Integration** | [Vercel AI SDK](https://sdk.vercel.ai/) (`ai`, `@ai-sdk/openai`) | Streaming copilot chat, structured plan generation via Neon AI Gateway or OpenAI |
| **Drag & Drop** | [@dnd-kit](https://dndkit.com/) (`core`, `sortable`, `utilities`) | Smooth drag-and-drop reordering for timeline tasks |
| **Data Visualization** | [Recharts](https://recharts.org/) | Interactive breakdown charts for event budget allocations |
| **Validation** | [Zod](https://zod.dev/) | Runtime request and form data validation schemas |

---

## File Structure

```text
wedding/
├── .env.example               # Template for required environment variables
├── .gitignore                  # Git ignore rules for node_modules, build outputs, and secrets
├── AGENTS.md                   # Agent and IDE guidelines
├── drizzle.config.ts           # Drizzle Kit migration and database configuration
├── eslint.config.mjs           # ESLint 9 configuration with Next.js rules
├── neon.ts                     # Neon CLI configuration (Managed Auth & AI Gateway)
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies and npm scripts
├── README.md                   # Project documentation and architectural overview
├── tsconfig.json               # TypeScript compiler configuration with @/* path aliases
│
├── public/                     # Static assets (SVGs, icons, images)
│
├── scripts/
│   └── seed-templates.ts       # Script to upsert default event templates (wedding, birthday, community)
│
└── src/
    ├── middleware.ts           # Route middleware for authentication and session guarding
    │
    ├── app/                    # Next.js App Router (pages and API routes)
    │   ├── favicon.ico
    │   ├── globals.css         # Theme colors, CSS variables, and global styles
    │   ├── layout.tsx          # Root layout with site header and toast provider
    │   ├── page.tsx            # Public landing page with feature showcase
    │   │
    │   ├── (auth)/             # Authentication route group
    │   │   ├── sign-in/        # Sign-in page
    │   │   └── sign-up/        # Registration page
    │   │
    │   ├── api/                # API Route Handlers
    │   │   ├── ai/
    │   │   │   ├── chat/route.ts           # Streaming copilot chat endpoint
    │   │   │   ├── generate-plan/route.ts  # Structured event plan generation endpoint
    │   │   │   └── ideas/route.ts          # Brainstorming & suggestion ideas endpoint
    │   │   └── auth/
    │   │       └── [...all]/route.ts       # Better Auth API handler
    │   │
    │   ├── dashboard/          # User dashboard listing all personal events
    │   │   └── page.tsx
    │   │
    │   └── events/
    │       ├── new/            # Multi-step event creation wizard
    │       │   └── page.tsx
    │       └── [eventId]/      # Dynamic event management hub
    │           ├── layout.tsx  # Event tab navigation layout
    │           ├── page.tsx    # Event overview summary
    │           ├── assistant/  # Dedicated AI assistant chat view
    │           │   └── page.tsx
    │           ├── budget/     # Interactive budget management & chart breakdown
    │           │   └── page.tsx
    │           ├── timeline/   # Drag-and-drop chronological timeline checklist
    │           │   └── page.tsx
    │           └── vendors/    # Vendor management board and quotes
    │               └── page.tsx
    │
    ├── components/             # Modular React UI components
    │   ├── site-header.tsx     # Global top navigation with user state
    │   ├── sign-out-button.tsx # Client sign-out action button
    │   │
    │   ├── assistant/          # Copilot chat components
    │   │   ├── assistant-drawer.tsx # Slide-out floating assistant drawer
    │   │   └── chat-panel.tsx       # Embedded chat interface
    │   │
    │   ├── budget/             # Budget tracking components
    │   │   └── budget-board.tsx     # Categories, allocations, items, and Recharts pie
    │   │
    │   ├── events/             # Event overview and management
    │   │   ├── delete-event-button.tsx
    │   │   ├── event-card.tsx
    │   │   ├── event-header.tsx
    │   │   ├── event-tabs.tsx
    │   │   ├── event-wizard.tsx
    │   │   └── ideas-panel.tsx
    │   │
    │   ├── timeline/           # Schedule and milestone tracking
    │   │   └── timeline-board.tsx   # DND-kit sortable tasks with overdue detection
    │   │
    │   ├── ui/                 # Reusable primitive design system components
    │   │   ├── badge.tsx
    │   │   ├── button.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── progress.tsx
    │   │   └── textarea.tsx
    │   │
    │   └── vendors/            # Vendor tracking components
    │       └── vendor-board.tsx     # Categorized vendor contacts, statuses, and costs
    │
    ├── db/
    │   └── schema.ts           # Drizzle schema (users, events, budgets, timelines, vendors, templates)
    │
    └── lib/                    # Core business logic and shared services
        ├── templates.ts        # Built-in seed templates for weddings, birthdays, and community events
        ├── utils.ts            # Formatting helpers (currency, dates, clsx merger)
        │
        ├── actions/            # Next.js Server Actions (data mutations)
        │   ├── budget.ts       # Create/edit/delete categories and budget items
        │   ├── events.ts       # Create, update, and delete events
        │   ├── timeline.ts     # Create/update tasks and persist reordered positions
        │   └── vendors.ts      # Create/update/delete vendors
        │
        ├── ai/                 # AI service integration
        │   ├── client.ts       # Model initialization (Neon AI Gateway or OpenAI BYOK)
        │   ├── prompts.ts      # Structured prompts and schemas for plans and ideas
        │   └── rate-limit.ts   # In-memory per-user rate limiting (20 req/min)
        │
        ├── auth/               # Better Auth integration
        │   ├── auth.ts         # Better Auth server configuration
        │   ├── client.ts       # Better Auth client for frontend hooks
        │   └── session.ts      # Session resolution helpers for Server Components & Actions
        │
        ├── db/                 # Database connection & queries
        │   ├── index.ts        # Neon serverless pool & Drizzle client initialization
        │   ├── queries.ts      # Cached queries for events, dashboard, and event details
        │   └── seed-event.ts   # Hydrates new events from default or generated templates
        │
        └── validations/        # Zod validation schemas
            └── event.ts        # Event form and creation validation schemas
```

---

## App Map & Routes

| Route | Access | Purpose |
| :--- | :--- | :--- |
| `/` | Public | Landing page explaining Gatherly features and benefits |
| `/sign-in` | Public | User authentication login |
| `/sign-up` | Public | New account registration |
| `/dashboard` | Protected | User dashboard displaying personal events and quick creation |
| `/events/new` | Protected | Multi-step wizard: Type Selection -> Details -> AI Plan Review |
| `/events/[eventId]` | Protected | Event Overview summary with high-level stats and recommendations |
| `/events/[eventId]/budget` | Protected | Interactive budget categories, items, and cost allocation breakdown |
| `/events/[eventId]/timeline` | Protected | Drag-and-drop chronological timeline with milestone and overdue tracking |
| `/events/[eventId]/vendors` | Protected | Vendor contacts, status pipelines (contacted/hired), and quotes |
| `/events/[eventId]/assistant`| Protected | Full-page AI planning assistant (also available via floating drawer) |

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Configure the required variables in `.env.local`:

```ini
# Database (Neon Serverless Postgres pooled connection string)
DATABASE_URL="postgres://user:password@ep-example.neon.tech/neondb?sslmode=require"

# Better Auth
BETTER_AUTH_SECRET="your-32-byte-base64-random-string"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# AI Provider (Choose Neon AI Gateway or standard OpenAI API key)
OPENAI_API_KEY="sk-..."
```

### 3. Sync Database & Seed Templates

```bash
npm run db:push
npm run seed:templates
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), register an account, and create your first event!

---

## Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `dev` | `next dev` | Starts the Next.js local development server with Turbopack |
| `build` | `next build` | Builds the optimized production application |
| `start` | `next start` | Starts the production server |
| `lint` | `eslint` | Runs ESLint 9 checks across all source files |
| `db:generate` | `drizzle-kit generate` | Generates SQL migration files from `src/db/schema.ts` |
| `db:migrate` | `drizzle-kit migrate` | Executes pending SQL migrations against your database |
| `db:push` | `drizzle-kit push` | Directly syncs the Drizzle schema to the Postgres database |
| `db:studio` | `drizzle-kit studio` | Opens the local Drizzle Studio database browser |
| `seed:templates` | `tsx ... scripts/seed-templates.ts` | Seeds default wedding, birthday, and community event templates |

---

## Neon CLI Integration (Optional)

```bash
neon init   # or neon link
neon deploy
neon env pull
```

> **Note:** The Neon AI Gateway requires a paid Neon plan and a supported AWS region (`aws-us-east-1/2`, `aws-eu-central-1`, `aws-ap-southeast-1`). When deploying without the AI Gateway, set `OPENAI_API_KEY` directly in `.env.local`; plan generation will gracefully fall back to pre-built templates if AI is unavailable.

---

## Security & Architecture Notes

- **User Data Isolation:** All event entities (events, budgets, timeline tasks, vendors) are strictly foreign-keyed and scoped by `userId`. Server Actions and route handlers verify session authentication before executing operations.
- **AI Rate Limiting:** Built-in in-memory rate limiting guards AI endpoints against abuse (20 requests per minute per user).
- **Secrets Management:** `.env.local` is ignored by Git; never commit real credentials or keys to version control.
