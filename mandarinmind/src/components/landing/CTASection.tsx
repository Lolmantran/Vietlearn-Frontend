import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-linear-to-br from-teal-900 via-teal-800 to-slate-900">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
          Ready to say{" "}
          <span className="text-teal-400">&ldquo;Xin chào!&rdquo;</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-teal-100/70">
          Join thousands of English speakers already learning Vietnamese with VietLearn.
          Start your first lesson in under 2 minutes — for free.
        </p>
        <div className="mt-8">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-teal-400 text-teal-950 hover:bg-teal-300 font-bold shadow-xl"
              rightIcon={<ArrowRight size={18} />}
            >
              Get started for free
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
