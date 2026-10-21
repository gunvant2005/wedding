"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Crown } from "lucide-react";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    const { error } = await signIn.email({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Could not sign in");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
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
          autoComplete="current-password"
          minLength={8}
          placeholder="••••••••"
        />
      </div>
      <Button type="submit" className="w-full mt-2" disabled={loading}>
        {loading ? "Authenticating..." : "Enter Atelier"}
      </Button>
    </form>
  );
}

export default function SignInPage() {
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
            Client Atelier Access
          </p>
        </div>

        <Suspense fallback={<div className="mt-8 py-6 text-center text-xs text-[#C5A059] animate-pulse">Loading atelier portal...</div>}>
          <SignInForm />
        </Suspense>

        <p className="mt-6 text-center text-xs text-[#B8B09F]">
          New to Gatherly Atelier?{" "}
          <Link href="/sign-up" className="font-semibold text-[#DFB15B] hover:underline">
            Request an Invitation
          </Link>
        </p>
      </div>
    </div>
  );
}
