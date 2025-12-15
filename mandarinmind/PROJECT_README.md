# MandarinMind Frontend

A modern Chinese learning web application built with Next.js, designed for English-speaking learners.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **API Client:** Axios
- **Icons:** Lucide React
- **Charts:** Recharts
- **Audio:** React Howler
- **Date Utilities:** date-fns

## 📁 Project Structure

```
mandarinmind/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx      # React Query & other providers
├── components/
│   ├── ui/               # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── ProgressBar.tsx
│   ├── flashcard/        # Flashcard components
│   │   ├── Flashcard.tsx
│   │   └── FlashcardSession.tsx
│   ├── quiz/             # Quiz components
│   │   ├── QuizQuestionCard.tsx
│   │   └── QuizSession.tsx
│   ├── progress/         # Progress tracking components
│   │   ├── StreakDisplay.tsx
│   │   ├── LevelProgress.tsx
│   │   └── AchievementCard.tsx
│   └── layout/           # Layout components
│       └── Sidebar.tsx
├── lib/
│   ├── api/              # API client & endpoints
│   │   ├── client.ts
│   │   ├── vocabulary.ts
│   │   ├── user.ts
│   │   ├── quiz.ts
│   │   └── review.ts
│   ├── srs/              # Spaced Repetition System
│   │   └── algorithm.ts
│   └── utils/            # Utility functions
│       ├── cn.ts         # Class name utilities
│       ├── audio.ts      # Audio playback
│       └── format.ts     # Formatting helpers
├── hooks/                # Custom React hooks
│   ├── useVocabulary.ts
│   ├── useUser.ts
│   └── useReviews.ts
├── store/                # Zustand state management
│   ├── userStore.ts
│   ├── learningStore.ts
│   └── uiStore.ts
├── types/                # TypeScript type definitions
│   ├── vocabulary.ts
│   ├── user.ts
│   ├── quiz.ts
│   └── api.ts
└── constants/            # App constants
    └── index.ts          # HSK levels, XP rewards, etc.
```

## 🎯 Core Features

### 1. **Vocabulary Learning System**
- Chinese characters with pinyin and tone marks
- English definitions with synonyms
- Audio pronunciation via Google TTS
- HSK level categorization (1-9)
- Example sentences

### 2. **Flashcard Mode**
- Chinese ↔ English practice
- Audio playback
- Immediate feedback
- Progress tracking

### 3. **Quiz System**
- Multiple-choice questions
- Reading & meaning quizzes
- Audio-based questions
- Score tracking

### 4. **Spaced Repetition System (SRS)**
- 9-level progression system
- Smart review scheduling
- Forgetting curve algorithm
- Review queue management

### 5. **Gamification**
- XP & Level system
- Learning streaks (48h leniency)
- Achievements & badges
- Progress visualization

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Environment Variables
Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

## 📦 Key Dependencies

- **next**: ^16.0.10
- **react**: ^19.2.1
- **tailwindcss**: ^4
- **zustand**: State management
- **@tanstack/react-query**: Server state management
- **axios**: HTTP client
- **date-fns**: Date utilities
- **lucide-react**: Icon library
- **recharts**: Charts for progress visualization
- **react-howler**: Audio playback

## 🎨 UI Components

All components are built with Tailwind CSS and support:
- Multiple variants (primary, secondary, outline, etc.)
- Different sizes (sm, md, lg)
- Loading states
- Disabled states
- Responsive design

## 🔌 API Integration

The app connects to a NestJS backend with the following endpoints:

- `/vocabulary` - Vocabulary management
- `/user` - User profile & stats
- `/quiz` - Quiz generation & results
- `/reviews` - SRS review system
- `/achievements` - Gamification

## 📱 Responsive Design

- Mobile-first approach
- Collapsible sidebar
- Touch-friendly components
- Optimized for all screen sizes

## 🚀 Next Steps

1. Set up authentication (NextAuth.js)
2. Connect to backend API
3. Implement protected routes
4. Add more quiz types
5. Create admin dashboard
6. Add social features

## 📄 License

Private project for Chinese learning platform.
