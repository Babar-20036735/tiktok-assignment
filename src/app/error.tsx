"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong!
          </h1>
          <p className="text-gray-600 mb-4">
            We encountered an unexpected error. Please try again or go back to
            the home page.
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="mb-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Error details
              </summary>
              <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>

        <div className="space-y-3">
          <Button
            onClick={reset}
            className="w-full flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try again</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="w-full flex items-center justify-center space-x-2"
          >
            <Home className="h-4 w-4" />
            <span>Go home</span>
          </Button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>Error ID: {error.digest || "unknown"}</p>
        </div>
      </div>
    </div>
  );
}
