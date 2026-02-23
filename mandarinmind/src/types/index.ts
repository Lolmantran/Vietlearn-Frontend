// ─── Auth & User ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  level: VietnameseLevel;
  goals: LearningGoal[];
  dailyGoalMinutes: number;
  streakDays: number;
  totalWordsLearned: number;
  createdAt: string;
}

export type VietnameseLevel =
  | "absolute_beginner"
  | "beginner"
  | "elementary"
  | "intermediate"
  | "upper_intermediate"
  | "advanced";

export type LearningGoal =
  | "travel"
  | "daily_conversation"
  | "business"
  | "exam"
  | "culture"
  | "heritage";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthCredentials {
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export interface PlacementAnswer {
  questionId: string;
  selectedOption: string;
}

export interface PlacementTestResult {
  estimatedLevel: VietnameseLevel;
  score: number;
  suggestedGoals: LearningGoal[];
  suggestedPath: string;
}

export interface OnboardingGoalsPayload {
  goals: LearningGoal[];
  level: VietnameseLevel;
  dailyGoalMinutes: number;
}

export interface UpdateMePayload {
  level?: VietnameseLevel;  // frontend level, converted to CEFR by authApi
  goals?: LearningGoal[];   // frontend goal keys, converted by authApi
  dailyGoal?: number;       // minutes
}

export interface PlacementQuestion {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  type: "multiple_choice" | "audio";
}

// ─── Vocabulary & Flashcards ──────────────────────────────────────────────────

export type SRSRating = "Again" | "Hard" | "Good" | "Easy";

export type DeckType = "core" | "travel" | "business" | "custom" | "by_topic";

export interface VocabCard {
  id: string;
  english: string;
  vietnamese: string;
  pronunciation: string; // Romanised or IPA
  toneMarks: string; // Vietnamese with full tone marks
  audioUrl?: string;
  exampleEnglish: string;
  exampleVietnamese: string;
  partOfSpeech: string;
  level: VietnameseLevel;
  tags: string[];
  imageUrl?: string;
  // SRS metadata
  srsLevel: number; // 0-9
  nextReviewAt?: string;
  dueToday?: boolean;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  type: DeckType;
  cardCount: number;      // alias for totalCards
  learnedCount: number;   // alias for enrolledCount
  coverEmoji: string;
  level: VietnameseLevel;
  // Extra fields from backend (kept for reference)
  isOwned?: boolean;
  totalCards?: number;
  enrolledCount?: number;
}

export interface ReviewPayload {
  cardId: string;   // sent as flashcardId to backend
  rating: SRSRating;
}

export interface ReviewResponse {
  cardId?: string;
  nextReviewAt: string;
  newSrsLevel?: number;
  interval?: number;
  xpEarned?: number;
}

export interface EnrollResponse {
  deckId: string;
  enrolled: number;
  alreadyEnrolled: number;
  total: number;
}

export interface CustomDeckPayload {
  inputText?: string;
  wordList?: string[];
  deckName: string;
}

// ─── Sentences ────────────────────────────────────────────────────────────────

export interface SentenceCheckPayload {
  targetLanguage: "vi";
  userSentence: string;
  referenceSentence?: string;
  context?: string;
}

export interface SentenceCorrection {
  original: string;
  corrected: string;
  type: "grammar" | "tone" | "vocabulary" | "spelling";
  explanation: string;
  position: { start: number; end: number };
}

export interface SentenceCheckResult {
  isCorrect: boolean;
  score: number; // 0-100
  corrections: SentenceCorrection[];
  explanation: string;
  naturalAlternatives: string[];
}

export interface PatternDrillTask {
  id: string;
  type: "reorder" | "fill_blank" | "translate";
  instruction: string;
  words?: string[];
  sentence?: string;
  blank?: { position: number; hint: string };
  referenceSentence: string;
  explanation: string;
}

export interface PatternDrillPayload {
  patternId?: string;
  topic?: string;
  level?: VietnameseLevel;
}

// ─── AI Tutor ─────────────────────────────────────────────────────────────────

export type TutorMode = "explain_everything" | "correct_me_a_lot" | "just_chat";

export interface TutorSession {
  id: string;
  topic: string;
  mode: TutorMode;
  createdAt: string;
  lastMessageAt: string;
  messageCount: number;
  previewText: string;
}

export interface TutorMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  corrections?: TutorCorrection[];
  suggestions?: string[];
  timestamp: string;
}

export interface TutorCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface CreateSessionPayload {
  topic: string;
  mode: TutorMode;
  level?: string;
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export type QuizQuestionType = "multiple_choice" | "listening" | "cloze";

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string; // English prompt or Vietnamese sentence with blank
  options?: string[]; // Display text for each option
  optionIds?: string[]; // Backend IDs for each option (parallel to options[])
  audioUrl?: string; // For listening
  correctAnswer: string;
  explanation: string;
  relatedCardId?: string;
}

export interface DailyQuiz {
  id: string;
  questions: QuizQuestion[];
  totalPoints: number;
  estimatedMinutes: number;
}

export interface QuizAnswer {
  questionId: string;
  userAnswer: string;
}

export interface QuizSubmitPayload {
  quizId: string;
  answers: QuizAnswer[];
}

export interface QuizFeedbackItem {
  questionId: string;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
}

export interface QuizResult {
  score: number;
  totalPoints: number;
  percentage: number;
  xpEarned: number;
  feedback: QuizFeedbackItem[];
  timeSpentSeconds: number;
}

// ─── Stats & Progress ─────────────────────────────────────────────────────────

export interface StatsOverview {
  totalWordsLearned: number;
  wordsDueToday: number;
  streakDays: number;
  xpToday: number;
  xpTotal: number;
  minutesStudiedToday: number;
  weeklyActivity: DayActivity[];
  nextRecommendedAction: RecommendedAction;
  lastActivity?: string;
}

export interface DayActivity {
  date: string;
  minutesStudied: number;
  wordsReviewed: number;
  xpEarned: number;
}

export interface RecommendedAction {
  type: "review" | "newWords" | "quiz" | "tutor" | "sentences";
  title: string;
  description: string;
  count?: number;
  href: string;
}

export interface TopicStats {
  topic: string;
  wordsLearned: number;
  accuracy: number;
  lastStudied: string;
  level: VietnameseLevel;
}

// ─── Content Generator ────────────────────────────────────────────────────────

export type ContentInputType = "text" | "topic";

export interface ContentGeneratePayload {
  inputType: ContentInputType;
  text?: string;
  topic?: string;
  level?: VietnameseLevel;
}

export interface GeneratedVocabItem {
  english: string;
  vietnamese: string;
  pronunciation: string;
  exampleSentence: string;
}

export interface GeneratedDialogueLine {
  speaker: "A" | "B";
  english: string;
  vietnamese: string;
  pronunciation: string;
}

export interface GeneratedPracticeTask {
  type: "translate" | "fill_blank" | "multiple_choice";
  prompt: string;
  options?: string[];
  answer: string;
}

export interface GeneratedLesson {
  id: string;
  title: string;
  topic: string;
  level: VietnameseLevel;
  vocabulary: GeneratedVocabItem[];
  dialogue: GeneratedDialogueLine[];
  practiceTasks: GeneratedPracticeTask[];
  culturalNote?: string;
}

// ─── API helpers ─────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
