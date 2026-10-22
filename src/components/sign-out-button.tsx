"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    if (isSigningOut) return;

    setIsSigningOut(true);
    try {
      const result = await signOut();

      if (result.error || !result.data?.success) {
        console.error("Sign-out failed:", result.error);
        toast.error("Unable to sign out right now. Please try again.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign-out request failed:", error);
      toast.error("Unable to sign out right now. Check your connection and try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      disabled={isSigningOut}
    >
      {isSigningOut ? "Signing out..." : "Sign out"}
    </Button>
  );
}
