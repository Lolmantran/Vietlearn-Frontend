"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setIsLoading(true);
    try {
      await register({ name, email, password });
      router.push("/onboarding");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Create your account</h2>
      <p className="text-sm text-slate-500 mb-6">Start learning Vietnamese for free</p>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          leftElement={<User size={16} />}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          leftElement={<Mail size={16} />}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          leftElement={<Lock size={16} />}
          hint="At least 8 characters"
        />

        <label className="flex items-start gap-2 text-sm text-slate-500 cursor-pointer">
          <input type="checkbox" required className="mt-0.5 rounded" />
          <span>
            I agree to the{" "}
            <a href="#" className="text-teal-600 hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-teal-600 hover:underline">Privacy Policy</a>
          </span>
        </label>

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Create account
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-teal-600 font-medium hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
