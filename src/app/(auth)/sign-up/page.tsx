"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signUp } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Crown } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    const { error } = await signUp.email({ name, email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Could not register");
      return;
    }
    toast.success("Account created successfully");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[rgba(197,160,89,0.3)] bg-[#121216]/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#DFB15B] shadow-[0_0_15px_rgba(197,160,89,0.2)]">
            <Crown className="h-5 w-5" />
          </div>
          <Link
            href="/"
            className="mt-4 inline-block font-[family-name:var(--font-display)] text-3xl tracking-wider text-[#FCFBF7]"
          >
            GATHERLY
          </Link>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059]">
            Begin Your Journey
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs uppercase tracking-wider text-[#DCD4C3]">Full Name / Couple Name</Label>
            <Input id="name" name="name" required placeholder="e.g. Burkay & Eleonora" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-wider text-[#DCD4C3]">Email Address</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs uppercase tracking-wider text-[#DCD4C3]">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="At least 8 characters"
            />
          </div>
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Creating Atelier Account..." : "Create Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-[#B8B09F]">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-[#DFB15B] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
