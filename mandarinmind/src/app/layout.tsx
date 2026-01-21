import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MandarinMind - Learn Chinese Characters with Ease",
  description: "Master Chinese characters and vocabulary with our intelligent spaced repetition system, interactive flashcards, and gamification. Start learning for free today!",
  keywords: ["Chinese learning", "Mandarin", "HSK", "flashcards", "spaced repetition", "vocabulary"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
