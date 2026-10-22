<div align="center">

# 🏛️ GATHERLY
### *Haute Couture Event Atelier & Intelligent Concierge*

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Cinzel&size=22&pause=1200&color=DFB15B&center=true&vCenter=true&width=640&lines=Bespoke+Luxury+Wedding+%26+Gala+Orchestration;Context-Aware+AI+Planning+Concierge;Precision+Budgets%2C+Timelines+%26+Vendor+Portfolios;Engineered+with+Next.js+16+%C2%B7+Neon+%C2%B7+Drizzle)](https://git.io/typing-svg)

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16.4-09090B?style=for-the-badge&logo=nextdotjs&logoColor=DFB15B&borderColor=C5A059" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React_19-09090B?style=for-the-badge&logo=react&logoColor=DFB15B&borderColor=C5A059" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind_4-09090B?style=for-the-badge&logo=tailwindcss&logoColor=DFB15B&borderColor=C5A059" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Neon_Postgres-09090B?style=for-the-badge&logo=postgresql&logoColor=DFB15B&borderColor=C5A059" alt="Neon Postgres" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-09090B?style=for-the-badge&logo=drizzle&logoColor=DFB15B&borderColor=C5A059" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/Better_Auth-09090B?style=for-the-badge&logo=auth0&logoColor=DFB15B&borderColor=C5A059" alt="Better Auth" />
  <img src="https://img.shields.io/badge/Vercel_AI_SDK-09090B?style=for-the-badge&logo=openai&logoColor=DFB15B&borderColor=C5A059" alt="AI SDK" />
</p>

---

<p align="center">
  <strong>Gatherly</strong> is an opulent, bespoke event planning atelier crafted for luxury weddings, galas, and milestones.<br />
  Featuring an ambient dark obsidian aesthetic, streaming AI concierge with tool calling, cents-accurate budget governance, drag-and-drop chronological milestone radar, and curated vendor directory management.
</p>

<p align="center">
  <a href="#-key-features"><strong>Features</strong></a> •
  <a href="#-system-architecture"><strong>Architecture</strong></a> •
  <a href="#-quick-start"><strong>Quick Start</strong></a> •
  <a href="#-app-routes"><strong>Routes</strong></a> •
  <a href="#-security--performance-certifications"><strong>Security & Performance</strong></a> •
  <a href="#-scripts"><strong>Scripts</strong></a>
</p>

</div>

---

## ✨ Key Features

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>🏛️ Atelier Dossier & Intelligence Snapshot</h3>
      <ul>
        <li><strong>Executive Parameters</strong>: Real-time calculation of allocated capital vs. reserve safety funds.</li>
        <li><strong>Hospitality Calculus</strong>: Automated banquet table estimations (10-top rounds) and 1:12 luxury service ratio checks.</li>
        <li><strong>1-Click Dossier Copy</strong>: Instant clipboard copy of the entire event dossier for printing or vendor handoff.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>💎 Context-Aware AI Concierge</h3>
      <ul>
        <li><strong>Event-Grounded Memory</strong>: The copilot is fed real-time budget balances, overdue tasks, and vendor statuses.</li>
        <li><strong>Live Tool Execution</strong>: Updates budget line-items, creates timeline tasks, and transitions vendor statuses on command.</li>
        <li><strong>Streaming Interface</strong>: Powered by Vercel AI SDK <code>streamText</code> with smooth token streaming.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>💰 High-Society Budget Atelier</h3>
      <ul>
        <li><strong>Cents-Level Precision</strong>: Zero floating-point arithmetic errors — every transaction stored as exact integer cents.</li>
        <li><strong>Category Percentage Breakdown</strong>: Visual distribution of funds across Venue, Couture, Catering, and Decor.</li>
        <li><strong>Interactive Recharts Pie</strong>: Luxury champagne gold palette with dollar-converted tooltips.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>⏳ Chronological Milestone Radar</h3>
      <ul>
        <li><strong>Drag & Drop Organization</strong>: Powered by <code>@dnd-kit</code> with optimistic reordering and persistent indexing.</li>
        <li><strong>Overdue Risk Detection</strong>: Automatic warning indicators for past-due tasks.</li>
        <li><strong>Milestone Flags</strong>: Highlight landmark dates (tasting, couture fitting, final rehearsal).</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🤝 Curated Vendor Directory</h3>
      <ul>
        <li><strong>Lifecycle Procurement</strong>: Move vendors through <code>researching</code> → <code>contacted</code> → <code>booked</code> → <code>paid</code>.</li>
        <li><strong>Contact Management</strong>: Direct logging for lead contacts, direct phone lines, and haute notes.</li>
        <li><strong>Status Badges</strong>: Color-coded luxury status tags with instant action menus.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>✨ Event Starter Presets</h3>
      <ul>
        <li><strong>Wedding reception</strong>: Editable starter details for a wedding event.</li>
        <li><strong>Birthday celebration</strong>: A starter plan for a birthday event.</li>
        <li><strong>Community fundraiser</strong>: A starter plan for a community event.</li>
        <li>Sample budgets and guest counts are editable starting points, not quotes.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🏛️ System Architecture

```mermaid
graph TD
    Client["Client Atelier (Next.js 16 / React 19 / Tailwind 4)"]
    
    subgraph AppRouter["Next.js App Router (RSC + Server Actions)"]
        Pages["Pages (/dashboard, /events/[id])"]
        Actions["Server Actions (budget, timeline, vendors)"]
        ApiAI["AI Routes (/api/ai/chat, generate-plan, ideas)"]
        Guard["CSRF & Session Guards"]
    end
    
    subgraph DataLayer["Data & Persistence Layer"]
        Drizzle["Drizzle ORM Engine"]
        NeonDB[("Neon Serverless Postgres")]
    end
    
    subgraph AIEngine["AI Orchestration Layer"]
        AiClient["Vercel AI SDK"]
        LLM["Gemini 2.5 Flash / OpenAI BYOK"]
        Tools["Atelier Tools (updateBudget, addTask, setVendor)"]
    end

    Client -->|HTTPS + Session Token| Guard
    Guard --> Pages
    Guard --> Actions
    Guard --> ApiAI
    
    Pages --> Drizzle
    Actions --> Drizzle
    ApiAI --> Drizzle
    
    Drizzle -->|Connection Pooling| NeonDB
    ApiAI --> AiClient
    AiClient --> LLM
    LLM -->|Tool Calling| Tools
    Tools --> Actions
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/gunvant2005/wedding.git
cd wedding
npm install
```

### 2. Configure Environment

Copy the example environment template:

```bash
cp .env.example .env.local
```

Configure your credentials inside `.env.local`:

```ini
# Database — Neon Serverless Postgres Pooled Connection
DATABASE_URL="postgresql://user:password@ep-example.neon.tech/neondb?sslmode=require"

# Better Auth — Generate with `openssl rand -base64 32`
BETTER_AUTH_SECRET="your-32-byte-base64-random-secret"
BETTER_AUTH_URL="http://localhost:3000"
# Optional explicit allowed origin for the AI API CSRF check; defaults to BETTER_AUTH_URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# AI Provider — OpenAI-compatible provider API key or Neon AI Gateway
OPENAI_API_KEY="sk-..."
# Must match the chosen provider's model identifier
AI_MODEL="gpt-4o-mini"
```

### 3. Initialize Database & Seed Templates

```bash
npm run db:push
npm run seed:templates
```

### 4. Launch Development Atelier

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to begin curating your premier affair.

---

## 🗺️ App Routes

| Route | Access | Experience |
|:---|:---:|:---|
| `/` | Public | **Salon Landing**: Hero introduction, feature pillars, and access request |
| `/sign-in` | Public | **Client Atelier Login**: Secure authentication with Suspense fallback |
| `/sign-up` | Public | **Request Invitation**: New patron account registration |
| `/dashboard` | Protected | **Curated Portfolio**: Dynamic stats, countdown spotlight, and vision vault |
| `/events/new` | Protected | **Atelier Wizard**: 3-step event orchestration with instant AI plan synthesis |
| `/events/[id]` | Protected | **Executive Dossier**: Full parameters, specs, hospitality, and milestone tabs |
| `/events/[id]/budget` | Protected | **Capital Allocation**: Interactive categories, line items, and Recharts breakdown |
| `/events/[id]/timeline` | Protected | **Milestone Radar**: Drag-and-drop chronological timeline with overdue flags |
| `/events/[id]/vendors` | Protected | **Vendor Directory**: Procurement stages, contracts, quotes, and direct contacts |
| `/events/[id]/assistant` | Protected | **Private AI Concierge**: Dedicated full-screen consultation salon |

---

## 🛡️ Security, Performance & Accessibility

The application includes authentication and ownership checks in server actions, request validation, a per-request nonce-based production CSP, and accessibility affordances including skip navigation, reduced-motion support, and keyboard-operable timeline reordering. These are implementation measures, not an independent security certification or WCAG conformance claim. Run the project checks before deployment and perform a dedicated accessibility and security review against the production configuration.

At the time of review (2026-10-22), `npm audit` reports nine advisories: five high-severity findings in the ESLint/Next.js development-tool dependency chain and four moderate findings in Drizzle Kit's `@esbuild-kit`/esbuild chain. `npm audit --omit=dev` still reports the four moderate findings because Better Auth declares Drizzle Kit as an optional peer dependency. npm's suggested remediation downgrades Drizzle Kit across a major version, so it was not applied; recheck for a compatible upstream release and keep development servers private while the esbuild advisory remains. Treat the audit as outstanding and rerun it before deployment.

---

## 📜 Available Scripts

```bash
# Development & Build
npm run dev               # Start Next.js local development with Turbopack
npm run build             # Build production bundle
npm run start             # Start production server
npm run lint              # Run ESLint checks

# Testing & Quality
npm run test              # Execute unit test suite (money, dates, CSRF, sanitization, schemas)
npm run test:all          # Run both unit tests and end-to-end integration tests
npm run test:ai           # Test AI provider connectivity
npm run verify:keys       # Run full diagnostic of database, auth, and AI keys

# Database Governance
npm run db:push           # Push Drizzle schema directly to Neon Postgres
npm run db:generate       # Generate SQL migrations
npm run db:migrate        # Execute pending SQL migrations
npm run db:studio         # Open Drizzle Studio visual browser
npm run seed:templates    # Seed default templates (wedding, birthday, community)
```

`npm run test:all` writes and deletes database records. Set `TEST_DATABASE_URL` in your local environment to a disposable test database before running it; the script refuses to use `DATABASE_URL` as a fallback. `npm run test:all` also exercises the configured AI provider and may incur provider charges.

---

<div align="center">
  <sub>Crafted with passion for haute-couture celebrations. Designed by the Gatherly Atelier Team.</sub>
</div>
