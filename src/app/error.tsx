"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Friendly Icon */}
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <div className="text-4xl">😅</div>
          </div>
        </div>

        {/* User-Friendly Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Oops! Something unexpected happened
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Don&apos;t worry, this happens sometimes. We&apos;re here to help
            you get back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            onClick={reset}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>

          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg font-medium transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Home
          </Button>

          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="w-full text-gray-500 hover:text-gray-700 py-2 px-4 text-sm"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Go Back
          </Button>
        </div>

        {/* Helpful Tips */}
        <div className="bg-blue-50 rounded-lg p-4 text-left">
          <h3 className="font-medium text-blue-900 mb-2">💡 Quick Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Check your internet connection</li>
            <li>• Try refreshing the page</li>
            <li>• Clear your browser cache</li>
          </ul>
        </div>

        {/* Development Error Details (Hidden from users) */}
        {process.env.NODE_ENV === "development" && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700 font-mono">
              🔧 Developer: Error Details
            </summary>
            <div className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded border">
              <p className="font-mono break-all">{error.message}</p>
              {error.digest && (
                <p className="mt-1 text-gray-500">ID: {error.digest}</p>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
