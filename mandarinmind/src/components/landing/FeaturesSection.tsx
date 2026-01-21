"use client";

import { Brain, Zap, Trophy, BarChart3, Volume2, Sparkles, Clock, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

const features = [
  {
    icon: Brain,
    title: "Spaced Repetition System",
    description: "Learn efficiently with our SRS algorithm that adapts to your learning pace and ensures long-term retention.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Interactive Flashcards",
    description: "Practice with smart flashcards that help you master Chinese characters, pinyin, and meanings.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Volume2,
    title: "Audio Pronunciation",
    description: "Listen to native pronunciation for every word and example sentence to perfect your speaking.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Trophy,
    title: "Gamification & Streaks",
    description: "Stay motivated with XP, levels, achievements, and daily streaks. Make learning addictive!",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Visualize your learning journey with detailed statistics, charts, and progress reports.",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: Target,
    title: "HSK Levels 1-9",
    description: "Follow the official HSK curriculum with carefully curated word lists for each level.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Sparkles,
    title: "Smart Quiz System",
    description: "Test your knowledge with multiple-choice, audio, and reading quizzes tailored to your level.",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: Clock,
    title: "Daily Review Queue",
    description: "Never forget what you've learned. Our smart algorithm reminds you exactly when to review.",
    color: "from-orange-500 to-red-500",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything you need to master Chinese
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to make your Chinese learning journey effective, efficient, and enjoyable.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                variant="bordered"
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6 space-y-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
