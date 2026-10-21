"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Gatherly atelier runtime error:", error);
  }, [error]);

  return (
    <div className="page-shell flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md rounded-3xl border border-[rgba(197,160,89,0.3)] bg-[#121216]/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(197,160,89,0.4)] bg-[#DFB15B]/10 text-[#DFB15B] shadow-[0_0_20px_rgba(197,160,89,0.2)]">
          <AlertCircle className="h-7 w-7" />
        </div>

        <h1 className="mt-5 font-[family-name:var(--font-display)] text-3xl text-[#FCFBF7]">
          An Unexpected Interruption
        </h1>
        <p className="mt-2 text-xs text-[#B8B09F] leading-relaxed">
          The atelier encountered a brief divergence while orchestrating this request. Your data remains secure.
        </p>

        {error?.digest && (
          <p className="mt-2 font-mono text-[10px] text-[#8C6D48]">
            Reference: {error.digest}
          </p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto"
            size="default"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Resume Atelier
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto border-[rgba(197,160,89,0.3)] text-[#FCFBF7] hover:border-[#DFB15B]"
            size="default"
          >
            <Link href="/dashboard">
              <Home className="h-4 w-4 mr-1.5" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
