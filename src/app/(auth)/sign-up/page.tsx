"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState, useId } from "react";
import { signUp } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { toast } from "sonner";
import { Crown, Eye, EyeOff, ShieldCheck, CheckCircle2 } from "lucide-react";

function SignUpForm() {
  const params = useSearchParams();
  const requestedNext = params.get("next") || "/dashboard";
  const next =
    requestedNext.startsWith("/") &&
    !requestedNext.startsWith("//") &&
    !requestedNext.includes("\\")
      ? requestedNext
      : "/dashboard";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const statusId = useId();
  const pwReqId = useId();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (!name.trim()) {
      const msg = "Please provide your name or couple title.";
      setStatusMsg(msg);
      toast.error(msg);
      return;
    }
    if (!email.trim()) {
      const msg = "Please provide a valid email address.";
      setStatusMsg(msg);
      toast.error(msg);
      return;
    }
    if (password.length < 8) {
      const msg = "Password must be at least 8 characters for security.";
      setStatusMsg(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    setStatusMsg("Creating your account…");

    try {
      const result = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.error) {
        const errMsg = result.error.message || result.error.statusText || "Could not register";
        console.warn("Sign-up notice:", result.error);

        let friendlyMsg: string;
        if (
          errMsg.toLowerCase().includes("exist") ||
          errMsg.toLowerCase().includes("already in use") ||
          result.error.code === "USER_ALREADY_EXISTS"
        ) {
          friendlyMsg = "An account with this email already exists. Please Sign In instead!";
        } else if (result.error.code === "INVALID_ORIGIN" || result.error.status === 403) {
          friendlyMsg = "Origin not allowed. Please refresh and try again.";
        } else {
          friendlyMsg = errMsg;
        }
        setStatusMsg(friendlyMsg);
        toast.error(friendlyMsg);
        return;
      }

      const successMsg = "Account created. Welcome to Gatherly.";
      setStatusMsg(successMsg);
      toast.success(successMsg);
      window.location.href = next;
    } catch (error) {
      console.warn("Registration request error:", error);
      const errorMsg = "Unable to create your account right now. Please check your connection and try again.";
      setStatusMsg(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  const isPasswordValid = password.length >= 8;

  return (
    <>
      {/* Accessible live region for screen readers */}
      <div
        id={statusId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {statusMsg}
      </div>

      <form
        onSubmit={onSubmit}
        method="POST"
        action="#"
        className="mt-8 space-y-4"
        aria-describedby={statusId}
        noValidate
      >
      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-xs uppercase tracking-wider text-[#DCD4C3]">
          Full Name / Couple Name
        </Label>
        <Input
          id="name"
          name="name"
          required
          autoComplete="name"
          placeholder="e.g. Eleanor & Julian"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          aria-required="true"
        />
      </div>

      {/* Email */}
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
          aria-required="true"
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
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((prev) => !prev)}
            className="flex items-center gap-1 text-[11px] font-medium text-[#C5A059] hover:text-[#DFB15B] transition-colors cursor-pointer"
          >
            {showPassword ? (
              <>
                <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Hide</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
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
            autoComplete="new-password"
            minLength={8}
            aria-describedby={pwReqId}
            aria-required="true"
            aria-invalid={password.length > 0 && !isPasswordValid}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="pr-10"
          />
        </div>

        {/* Real-time Password check helper */}
        <div id={pwReqId} className="flex items-center gap-1.5 pt-1 text-[11px]" aria-live="polite">
          <CheckCircle2
            className={`h-3.5 w-3.5 ${isPasswordValid ? "text-[#DFB15B]" : "text-[#3A3A45]"}`}
            aria-hidden="true"
          />
          <span className={isPasswordValid ? "text-[#DFB15B]" : "text-[#948B79]"}>
            {isPasswordValid ? "Password meets security requirement" : "Requires at least 8 characters"}
          </span>
        </div>
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        className="w-full mt-4 h-11 text-xs tracking-widest uppercase"
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? "Creating account…" : "Create account"}
      </Button>

      <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-[#948B79]">
        <ShieldCheck className="h-3.5 w-3.5 text-[#C5A059]" aria-hidden="true" />
        <span>Password protected account</span>
      </div>
      </form>
      <p className="mt-6 text-center text-xs text-[#B8B09F]">
        Already have an account?{" "}
        <Link
          href={`/sign-in?next=${encodeURIComponent(next)}`}
          className="font-semibold text-[#DFB15B] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}

export default function SignUpPage() {
  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[rgba(197,160,89,0.3)] bg-[#121216]/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#DFB15B] shadow-[0_0_15px_rgba(197,160,89,0.2)]">
            <Crown className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl tracking-wider text-[#FCFBF7]">
            <Link
              href="/"
              className="inline-block hover:text-[#DFB15B] transition-colors"
            >
              GATHERLY
            </Link>
          </h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059]">
            Begin Your Journey
          </p>
        </div>

        <ErrorBoundary>
          <Suspense fallback={<div className="mt-8 py-6 text-center text-xs text-[#C5A059] animate-pulse">Loading registration…</div>}>
            <SignUpForm />
          </Suspense>
        </ErrorBoundary>

      </div>
    </div>
  );
}
