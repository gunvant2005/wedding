"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Crown, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

function SignInForm() {
  const params = useSearchParams();
  const requestedNext = params.get("next") || "/dashboard";
  const next =
    requestedNext.startsWith("/") &&
    !requestedNext.startsWith("//") &&
    !requestedNext.includes("\\")
      ? requestedNext
      : "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRegisterHint, setShowRegisterHint] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (!email.trim() || !password) {
      toast.error("Please enter both your email address and password.");
      return;
    }

    setLoading(true);
    setShowRegisterHint(false);

    try {
      const result = await signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        const errMsg = result.error.message || result.error.statusText || "Could not sign in";
        console.warn("Sign-in notice:", result.error);

        if (
          result.error.code === "INVALID_EMAIL_OR_PASSWORD" ||
          result.error.status === 401 ||
          errMsg.toLowerCase().includes("invalid") ||
          errMsg.toLowerCase().includes("credential") ||
          errMsg.toLowerCase().includes("not found")
        ) {
          setShowRegisterHint(true);
          toast.error("Invalid email or password. If you don't have an account yet, create one below!");
        } else if (result.error.code === "INVALID_ORIGIN" || result.error.status === 403) {
          toast.error("Access origin rejected. Please refresh and try again.");
        } else {
          toast.error(errMsg);
        }
        return;
      }

      toast.success("Welcome back.");
      window.location.href = next;
    } catch (error) {
      console.warn("Sign-in request error:", error);
      toast.error("Unable to sign in right now. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} method="POST" action="#" className="mt-8 space-y-4">
      {/* Registration Hint Banner if credentials don't match */}
      {showRegisterHint && (
        <div className="rounded-xl border border-[rgba(223,177,91,0.4)] bg-[#1F1C14] p-3.5 text-xs text-[#E8D5B5] space-y-2">
          <div className="flex items-center gap-2 text-[#DFB15B] font-semibold">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Account Not Found or Password Incorrect</span>
          </div>
          <p className="text-[11px] text-[#D6D0C2] leading-relaxed">
            If you do not have an account yet, you can create one before continuing.
          </p>
          <Button asChild size="sm" className="w-full mt-1">
            <Link href={`/sign-up?next=${encodeURIComponent(next)}`}>
              Create an account
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      )}

      {/* Email input */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs uppercase tracking-wider text-[#DCD4C3]">
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Password with Show/Hide toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-xs uppercase tracking-wider text-[#DCD4C3]">
            Password
          </Label>
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="flex items-center gap-1 text-[11px] font-medium text-[#C5A059] hover:text-[#DFB15B] transition-colors cursor-pointer"
          >
            {showPassword ? (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                <span>Hide</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span>Show Password</span>
              </>
            )}
          </button>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            minLength={8}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="pr-10"
          />
        </div>
      </div>

      {/* Submit button */}
      <Button type="submit" className="w-full mt-4 h-11 text-xs tracking-widest uppercase" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </Button>

      <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-[#948B79]">
        <ShieldCheck className="h-3.5 w-3.5 text-[#C5A059]" />
        <span>Secure email and password sign-in</span>
      </div>
      </form>
      <p className="mt-6 text-center text-xs text-[#B8B09F]">
        New to Gatherly Atelier?{" "}
        <Link
          href={`/sign-up?next=${encodeURIComponent(next)}`}
          className="font-semibold text-[#DFB15B] hover:underline"
        >
          Create an account
        </Link>
      </p>
    </>
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

      </div>
    </div>
  );
}
