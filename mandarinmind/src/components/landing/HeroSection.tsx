"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Sparkles, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Animated Chinese Characters Background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-10 left-10 text-6xl animate-float">学</div>
        <div className="absolute top-20 right-20 text-5xl animate-float-delayed">习</div>
        <div className="absolute bottom-32 left-32 text-7xl animate-float">汉</div>
        <div className="absolute bottom-20 right-40 text-6xl animate-float-delayed">字</div>
        <div className="absolute top-1/2 left-1/4 text-8xl animate-float">中</div>
        <div className="absolute top-1/3 right-1/3 text-7xl animate-float-delayed">文</div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 text-center">
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white text-sm">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span>Master Chinese with AI-Powered Learning</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Learn Chinese
            <br />
            characters with{" "}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              ease.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            MandarinMind is a web app for learning <strong className="text-white">traditional and simplified</strong>{" "}
            Chinese characters and vocabulary using spaced repetition and gamification.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-6 text-lg min-w-[200px]"
              >
                <Zap className="mr-2 h-5 w-5" />
                Try For Free
              </Button>
            </Link>
            <a href="#features">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg min-w-[200px]"
              >
                Learn More
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 max-w-4xl mx-auto">
            {[
              { label: "Active Learners", value: "10,000+" },
              { label: "Words Available", value: "50,000+" },
              { label: "Learning Streaks", value: "1M+ days" },
              { label: "Success Rate", value: "95%" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
