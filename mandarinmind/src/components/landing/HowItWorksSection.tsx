const STEPS = [
  {
    num: "01",
    title: "Tell us your goals",
    description:
      "Choose what you want: travel, business, daily conversation… VietLearn tailors your entire path from day one.",
    color: "from-teal-500 to-teal-600",
  },
  {
    num: "02",
    title: "Quick placement test",
    description:
      "A 5-minute test finds your current level so you skip what you already know and focus on what matters.",
    color: "from-violet-500 to-violet-600",
  },
  {
    num: "03",
    title: "Learn with flashcards & drills",
    description:
      "Study vocabulary with smart flashcards and reinforce it through sentence drills and listening exercises.",
    color: "from-amber-500 to-amber-600",
  },
  {
    num: "04",
    title: "Chat with your AI tutor",
    description:
      "Put everything into practice talking with an AI that speaks Vietnamese, gently corrects you, and cheers you on.",
    color: "from-emerald-500 to-emerald-600",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 mb-3">
            Simple process
          </p>
          <h2 className="text-4xl font-bold text-slate-900">How VietLearn works</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={i} className="relative rounded-2xl bg-white border border-slate-100 p-6 shadow-sm overflow-hidden">
              <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${s.color}`} />
              <p className={`text-4xl font-black bg-linear-to-br ${s.color} bg-clip-text text-transparent mb-4`}>
                {s.num}
              </p>
              <h3 className="text-base font-semibold text-slate-800 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
