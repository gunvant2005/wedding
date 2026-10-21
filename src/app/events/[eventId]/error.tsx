"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Event workspace error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-full max-w-md rounded-2xl border border-[rgba(197,160,89,0.25)] bg-[#141418]/90 p-8 backdrop-blur-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#DFB15B]/30 bg-[#DFB15B]/10 text-[#DFB15B]">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl text-[#FCFBF7]">
          Unable to Load Event Workspace
        </h2>
        <p className="mt-2 text-xs text-[#B8B09F] leading-relaxed">
          {error.message || "An issue occurred retrieving the dossier parameters."}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={() => reset()} size="sm">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Retry
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-[rgba(197,160,89,0.3)] text-[#FCFBF7] hover:border-[#DFB15B]"
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Return to Portfolio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
