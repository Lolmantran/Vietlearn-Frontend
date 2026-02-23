import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Great to get started",
    features: [
      "100 core vocabulary cards",
      "Basic SRS reviews",
      "5 AI tutor messages / day",
      "Daily quiz",
    ],
    cta: "Start for free",
    href: "/auth/register",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For serious learners",
    features: [
      "Unlimited vocabulary cards",
      "All topic decks",
      "Unlimited AI tutor",
      "Sentence drills & feedback",
      "Content generator",
      "Detailed progress analytics",
    ],
    cta: "Start free trial",
    href: "/auth/register",
    highlight: true,
  },
  {
    name: "Lifetime",
    price: "$149",
    period: "one-time",
    description: "Pay once, own forever",
    features: [
      "Everything in Pro",
      "Lifetime updates",
      "Priority support",
      "Early access to new features",
    ],
    cta: "Buy lifetime access",
    href: "/auth/register",
    highlight: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-600 mb-3">
            Pricing
          </p>
          <h2 className="text-4xl font-bold text-slate-900">Simple, honest pricing</h2>
          <p className="mt-4 text-slate-500">Start free — upgrade when you&apos;re ready.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlight
                  ? "bg-teal-900 text-white shadow-2xl shadow-teal-900/30 scale-105"
                  : "bg-white border border-slate-200"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-teal-400 px-3 py-1 text-xs font-bold text-teal-950">
                    Most popular
                  </span>
                </div>
              )}
              <p className={`text-sm font-semibold ${plan.highlight ? "text-teal-300" : "text-teal-600"}`}>
                {plan.name}
              </p>
              <div className="mt-2 flex items-end gap-1">
                <span className={`text-4xl font-black ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                  {plan.price}
                </span>
                <span className={`mb-1 text-sm ${plan.highlight ? "text-teal-300" : "text-slate-400"}`}>
                  /{plan.period}
                </span>
              </div>
              <p className={`mt-1 text-sm ${plan.highlight ? "text-teal-200" : "text-slate-500"}`}>
                {plan.description}
              </p>

              <ul className="mt-6 mb-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check
                      size={15}
                      className={`mt-0.5 shrink-0 ${plan.highlight ? "text-teal-400" : "text-teal-500"}`}
                    />
                    <span className={plan.highlight ? "text-teal-100" : "text-slate-600"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <Button
                  className={`w-full ${
                    plan.highlight
                      ? "bg-teal-400 text-teal-950 hover:bg-teal-300"
                      : ""
                  }`}
                  variant={plan.highlight ? "primary" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
