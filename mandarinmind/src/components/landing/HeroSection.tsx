import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

const FLOATING_WORDS = [
  { text: "Xin chào!", top: "12%", left: "8%", rotate: "-8deg" },
  { text: "Cảm ơn", top: "25%", right: "7%", rotate: "6deg" },
  { text: "Học tiếng Việt", top: "60%", left: "5%", rotate: "-4deg" },
  { text: "Tuyệt vời!", top: "75%", right: "6%", rotate: "8deg" },
  { text: "Bạn giỏi lắm", top: "42%", right: "3%", rotate: "-5deg" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-linear-to-br from-teal-950 via-teal-900 to-slate-900 flex items-center overflow-hidden">
      {/* Background decorative Vietnamese phrases */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {FLOATING_WORDS.map((w, i) => (
          <span
            key={i}
            className="absolute text-white/[0.07] text-2xl font-bold whitespace-nowrap"
            style={{
              top: w.top,
              left: (w as { left?: string }).left ?? "auto",
              right: (w as { right?: string }).right ?? "auto",
              transform: `rotate(${w.rotate})`,
            }}
          >
            {w.text}
          </span>
        ))}
        {/* Large watermark */}
        <div className="absolute -bottom-8 -right-8 text-white/4 text-[200px] font-black select-none">
          Việt
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-24 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-sm text-teal-300">
          <Sparkles size={14} />
          AI-powered · Spaced repetition · Free to start
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight">
          Speak Vietnamese
          <br />
          <span className="text-teal-400">from day one</span>
        </h1>

        <p className="mt-6 mx-auto max-w-xl text-lg text-teal-100/70 leading-relaxed">
          The smartest way for English speakers to learn Vietnamese. Adaptive flashcards,
          AI conversation tutor, sentence drills — all in one beautiful app.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="bg-teal-400 text-teal-950 hover:bg-teal-300 font-bold shadow-xl shadow-teal-900/40" rightIcon={<ArrowRight size={18} />}>
              Start learning for free
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Continue learning
            </Button>
          </Link>
        </div>

        {/* Mini feature pills */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {[
            { icon: <BookOpen size={14} />, text: "1,500+ vocabulary cards" },
            { icon: <MessageSquare size={14} />, text: "AI conversation tutor" },
            { icon: <Sparkles size={14} />, text: "Personalised SRS schedule" },
          ].map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-teal-200"
            >
              <span className="text-teal-400">{f.icon}</span>
              {f.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
