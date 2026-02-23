"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
];

export function LandingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-teal-950/80 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-teal-400 flex items-center justify-center text-teal-950 font-bold text-lg">
            V
          </div>
          <span className="text-lg font-bold text-white">VietLearn</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-teal-100/80 hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="text-teal-100 hover:text-white hover:bg-white/10">
              Log in
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm" className="bg-teal-400 text-teal-950 hover:bg-teal-300">
              Get started free
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="block md:hidden text-white"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-teal-950 border-t border-white/10 px-6 pb-4 space-y-3">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block text-sm text-teal-100/80 hover:text-white py-1"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/auth/login" onClick={() => setOpen(false)}>
              <Button variant="outline" size="sm" className="w-full border-teal-400 text-teal-400 hover:bg-teal-400/10">
                Log in
              </Button>
            </Link>
            <Link href="/auth/register" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full bg-teal-400 text-teal-950 hover:bg-teal-300">
                Get started free
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
