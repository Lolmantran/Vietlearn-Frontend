import type { ReactNode } from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-teal-900 via-teal-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-10">
        {["chào", "học", "tiếng", "việt", "xin", "cảm", "ơn", "tôi"].map((word, i) => (
          <span
            key={i}
            className="absolute text-white text-4xl font-bold"
            style={{
              top: `${(i * 13 + 7) % 90}%`,
              left: `${(i * 17 + 5) % 90}%`,
              transform: `rotate(${(i * 15 - 30)}deg)`,
            }}
          >
            {word}
          </span>
        ))}
      </div>
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-lg">
              V
            </div>
            <span className="text-2xl font-bold text-white">VietLearn</span>
          </Link>
        </div>
        <div className="rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
