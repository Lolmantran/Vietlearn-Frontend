"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out MandarinMind",
    features: [
      "HSK 1-2 vocabulary",
      "Basic flashcards",
      "5 reviews per day",
      "Progress tracking",
      "Mobile access",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "per month",
    description: "For serious learners committed to fluency",
    features: [
      "All HSK levels (1-9)",
      "Unlimited reviews",
      "Advanced quizzes",
      "Audio pronunciation",
      "Custom word packs",
      "Detailed analytics",
      "Priority support",
      "Ad-free experience",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Lifetime",
    price: "$199",
    period: "one-time",
    description: "Best value for long-term learners",
    features: [
      "Everything in Pro",
      "Lifetime access",
      "All future features",
      "Premium support",
      "Early access to beta",
      "No recurring fees",
    ],
    cta: "Get Lifetime",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your learning goals. Start free, upgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              variant={plan.popular ? "elevated" : "bordered"}
              className={`relative ${
                plan.popular ? "border-2 border-purple-500 shadow-2xl scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge variant="info" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500">/ {plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/signup" className="block">
                  <Button
                    variant={plan.popular ? "primary" : "outline"}
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        : ""
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Money-back guarantee */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            All paid plans include a <strong className="text-gray-900">30-day money-back guarantee</strong>. No questions asked.
          </p>
        </div>
      </div>
    </section>
  );
}
