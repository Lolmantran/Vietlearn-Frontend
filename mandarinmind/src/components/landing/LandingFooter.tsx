import Link from "next/link";

const LINKS = {
  Product: ["Features", "How it works", "Pricing", "Changelog"],
  Learn: ["Vocabulary", "Sentences", "AI Tutor", "Quiz"],
  Company: ["About", "Blog", "Contact", "Privacy policy"],
};

export function LandingFooter() {
  return (
    <footer className="bg-teal-950 text-teal-100/60 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-md bg-teal-400 flex items-center justify-center text-teal-950 font-bold text-sm">
                V
              </div>
              <span className="text-base font-bold text-white">VietLearn</span>
            </div>
            <p className="text-sm leading-relaxed">
              AI-powered Vietnamese for English speakers. Speak with confidence from day one.
            </p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([category, items]) => (
            <div key={category}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-teal-300">
                {category}
              </p>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-teal-100/40">
          © {new Date().getFullYear()} VietLearn. Made with ❤️ for Vietnamese learners everywhere.
        </div>
      </div>
    </footer>
  );
}
