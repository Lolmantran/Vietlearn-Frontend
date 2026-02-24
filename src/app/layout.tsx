import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VietLearn – Learn Vietnamese with AI",
  description:
    "AI-powered Vietnamese learning platform for English speakers. Master vocabulary, conversation, and grammar with spaced repetition and an AI tutor.",
  keywords: ["Vietnamese", "learn Vietnamese", "AI language learning", "tiếng Việt"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
