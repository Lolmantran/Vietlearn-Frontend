"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Choose Your Path",
    description: "Select your learning goal: HSK levels, daily conversation, business Chinese, or create custom word packs.",
    features: ["HSK 1-9 curriculum", "Themed word packs", "Personalized learning"],
  },
  {
    step: "02",
    title: "Learn with Flashcards",
    description: "Master new vocabulary with interactive flashcards that teach characters, pinyin, pronunciation, and meanings.",
    features: ["Audio pronunciation", "Example sentences", "Visual mnemonics"],
  },
  {
    step: "03",
    title: "Practice with Quizzes",
    description: "Test your knowledge with multiple quiz types to reinforce learning from different angles.",
    features: ["Multiple choice", "Audio recognition", "Reading comprehension"],
  },
  {
    step: "04",
    title: "Review & Master",
    description: "Our spaced repetition system ensures you review words at the perfect time for maximum retention.",
    features: ["Smart scheduling", "Progress tracking", "Adaptive difficulty"],
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A proven 4-step process to help you achieve fluency in Chinese characters and vocabulary.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((item, index) => (
            <Card
              key={item.step}
              variant="elevated"
              className="overflow-hidden hover:shadow-2xl transition-shadow"
            >
              <CardContent className="p-0">
                <div className="grid md:grid-cols-12 gap-0">
                  {/* Step Number */}
                  <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-8">
                    <div className="text-white text-6xl font-bold opacity-50">{item.step}</div>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-10 p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      <div className="flex-1 space-y-3">
                        <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 text-lg">{item.description}</p>
                        <ul className="space-y-2 pt-2">
                          {item.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-gray-700">
                              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Illustration placeholder */}
                      <div className="w-full md:w-48 h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-6xl">
                          {index === 0 && "📚"}
                          {index === 1 && "🎴"}
                          {index === 2 && "📝"}
                          {index === 3 && "🎯"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
