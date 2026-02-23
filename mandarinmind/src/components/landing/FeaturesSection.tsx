import {
  Brain,
  MessageSquare,
  BarChart2,
  Shuffle,
  BookOpen,
  Headphones,
  Zap,
  Target,
} from "lucide-react";

const FEATURES = [
  {
    icon: <Brain className="text-teal-600" size={24} />,
    title: "Spaced Repetition",
    description:
      "AI-scheduled reviews ensure you see every word right before you'd forget it — maximising retention in minimum time.",
    bg: "bg-teal-50",
  },
  {
    icon: <MessageSquare className="text-violet-600" size={24} />,
    title: "AI Conversation Tutor",
    description:
      "Chat with an AI tutor that corrects your Vietnamese inline, explains grammar in plain English, and adapts to your level.",
    bg: "bg-violet-50",
  },
  {
    icon: <Shuffle className="text-amber-600" size={24} />,
    title: "Sentence Drills",
    description:
      "Reorder words, fill in blanks, and translate sentences. Instant AI feedback explains every correction.",
    bg: "bg-amber-50",
  },
  {
    icon: <BookOpen className="text-emerald-600" size={24} />,
    title: "Topic-based Decks",
    description:
      "Core vocabulary, travel, business, food, family — pre-built decks for every situation, or generate your own.",
    bg: "bg-emerald-50",
  },
  {
    icon: <Headphones className="text-blue-600" size={24} />,
    title: "Listening Practice",
    description:
      "Hear native-speed pronunciation for every word and sentence. Train your ear alongside your reading.",
    bg: "bg-blue-50",
  },
  {
    icon: <BarChart2 className="text-rose-600" size={24} />,
    title: "Progress Tracking",
    description:
      "Detailed stats on streaks, words mastered, accuracy by topic — stay motivated with clear evidence of progress.",
    bg: "bg-rose-50",
  },
  {
    icon: <Zap className="text-orange-600" size={24} />,
    title: "Daily Smart Quiz",
    description:
      "A fresh mixed quiz each day combining vocab, listening, and grammar — keeps learning lively and well-rounded.",
    bg: "bg-orange-50",
  },
  {
    icon: <Target className="text-pink-600" size={24} />,
    title: "Learn from Your Interests",
    description:
      "Paste any English text or pick a topic — we generate a mini Vietnamese lesson complete with vocab and dialogues.",
    bg: "bg-pink-50",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 mb-3">
            Everything you need
          </p>
          <h2 className="text-4xl font-bold text-slate-900">
            Learn smarter, not harder
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            VietLearn packs the most effective language-learning techniques into one coherent experience.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-100 bg-white p-6 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`mb-4 inline-flex rounded-xl p-3 ${f.bg}`}>{f.icon}</div>
              <h3 className="mb-2 text-base font-semibold text-slate-800">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
