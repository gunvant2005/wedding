"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  /** Content to render when no error has occurred. */
  children: ReactNode;
  /** Optional custom fallback UI. If not provided, a default styled error card is shown. */
  fallback?: ReactNode;
  /** Optional callback invoked when an error is caught, for external logging. */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * A React class-based Error Boundary that catches render-time errors in its
 * subtree and renders a graceful fallback UI rather than an unhandled crash.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <SomeComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to console in development; surface to external logger if provided
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary] Caught render error:", error, info.componentStack);
    }
    this.props.onError?.(error, info);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="flex flex-col items-center justify-center rounded-2xl border border-[rgba(197,160,89,0.25)] bg-[#121216]/90 px-6 py-14 text-center backdrop-blur-xl"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 text-[#DFB15B]">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-xl text-[#FCFBF7]">
            Something went wrong
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#948B79]">
            An unexpected error occurred. You can try refreshing this section or
            return to the dashboard.
          </p>
          {this.state.error && process.env.NODE_ENV !== "production" && (
            <pre className="mt-4 max-w-full overflow-auto rounded-lg border border-[rgba(197,160,89,0.15)] bg-[#0C0C0F] px-4 py-3 text-left text-[10px] text-[#E05252]">
              {this.state.error.message}
            </pre>
          )}
          <Button
            onClick={this.handleReset}
            size="sm"
            className="mt-6"
            aria-label="Retry rendering this section"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
