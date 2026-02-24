# VietLearn — Vietnamese Learning Platform

A full-featured Vietnamese language learning web app with spaced-repetition flashcards, AI tutoring, quizzes, grammar drills, and progress analytics.

---

## Features

### Authentication
- Email/password sign-up and login via a NestJS backend
- Google OAuth via **NextAuth v5** (`next-auth@beta`)
- Avatar display — Google profile photo for OAuth users, generated avatar (via `ui-avatars.com`) for email users
- JWT stored in `localStorage` + synced to a cookie so Next.js middleware can protect routes server-side
- **Protected routes** — all pages except `/`, `/login`, `/register`, and `/onboarding` require a valid session; unauthenticated requests redirect to `/login?from=<original-path>`

### Dashboard
- Streak, XP, words learned, and daily goal progress at a glance
- **Weekly activity bar chart** (Recharts) showing minutes studied per day
- **Daily goal ring** showing progress toward today's study target
- "Continue where you left off" — live data from the vocab progress API showing the top 3 decks with completion bars

### Vocabulary (Spaced Repetition)
- Deck library with icons and per-deck progress
- **Flashcard mode** — flip cards showing Vietnamese word, tone marks, part-of-speech badge, and English meaning
- **Multiple-choice review mode** — shuffled queue, nearest-neighbor distractors, colour-coded answer buttons (green/red), auto-advance after 1.5 s, session summary with XP earned
- **Part-of-speech badges** — colour-coded pills (noun, verb, adjective, adverb, pronoun, phrase, interjection)

### AI Tutor
- Real-time chat with a Vietnamese AI tutor
- Persistent session list with history
- Mode selector (conversation, grammar, vocabulary, translation)

### Quizzes
- Multiple-choice questions
- Cloze (fill-in-the-blank) questions
- Listening comprehension questions
- Session results screen

### Grammar / Sentences
- Pattern drill exercises
- Translation practice with feedback panel

### AI Content Generation
- Generate custom lessons / content via NestJS AI endpoints

### Settings
- **Profile** — display name, email, avatar
- **Learning goals** — CEFR level picker, goal tags, daily minute target
- **Notifications** — daily reminder toggle + time picker
- **Account** — email display, member since, change password, delete account
- **Billing** — trial alert banner, Free vs Pro plan comparison, billing history placeholder (all hardcoded to free/trial tier)

### CI/CD
- GitHub Actions workflow (`.github/workflows/ci.yml`) runs `lint` → `build` on every push; a failing build blocks the pipeline

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | NextAuth v5 beta (Google OAuth) + custom JWT |
| Server state | TanStack React Query v5 |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Cookie management | js-cookie |
| HTTP client | Custom fetch wrapper (`src/lib/api/client.ts`) |
| Backend | NestJS REST API (`http://localhost:3000/api`) |
| Node version (CI) | 20 LTS |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── (auth)/login & register # Public auth pages
│   ├── dashboard/              # Main dashboard
│   ├── learn/vocab & sentences # Learning modules
│   ├── tutor/                  # AI tutor chat
│   ├── quiz/                   # Quiz session
│   ├── content/                # AI content generator
│   ├── onboarding/             # New-user onboarding
│   ├── settings/               # User settings (5 sections)
│   ├── layout.tsx              # Root layout with Providers
│   └── providers.tsx           # SessionProvider + PreTokenSeeder
├── components/
│   ├── ui/                     # Button, Card, Input, Badge, Modal, …
│   ├── layout/                 # AppLayout, AuthLayout, Sidebar, TopBar
│   ├── vocab/                  # FlashCard, ReviewSession, PosBadge, …
│   ├── quiz/                   # MultipleChoice, Cloze, Listening, Results
│   ├── sentences/              # PatternDrill, TranslationPractice, …
│   ├── tutor/                  # ChatWindow, MessageBubble, SessionList
│   ├── content/                # ContentForm, GeneratedLessonView
│   └── landing/                # Hero, Features, Pricing, CTA, …
├── hooks/
│   ├── useAuth.tsx             # AuthContext + AuthProvider
│   ├── useVocab.ts             # Deck, flashcard, review, progress hooks
│   ├── useQuiz.ts
│   ├── useTutor.ts
│   └── useStats.ts
├── lib/
│   ├── api/                    # Per-domain API modules + shared client
│   ├── utils/cn.ts             # Tailwind class merging
│   └── utils/format.ts         # Level, date, number formatters
├── types/index.ts              # Shared TypeScript types
└── middleware.ts               # Route-protection middleware
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- NestJS backend running at `http://localhost:3000/api`

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# NextAuth (Google OAuth)
AUTH_SECRET=<random 32-char hex string>
AUTH_URL=http://localhost:3001
AUTH_GOOGLE_ID=<your Google client ID>
AUTH_GOOGLE_SECRET=<your Google client secret>
```

### 3. Run development server
```bash
npm run dev       # http://localhost:3001
```

### 4. Build for production
```bash
npm run build
npm start
```

---

## CI/CD

Every push triggers the GitHub Actions pipeline:

1. **Install** — `npm ci`
2. **Lint** — `npm run lint`
3. **Build** — `npm run build`

