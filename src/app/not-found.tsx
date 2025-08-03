import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <Search className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Page not found
          </h1>
          <p className="text-gray-600 mb-4">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go back</span>
          </Button>

          <Link href="/" className="block">
            <Button className="w-full flex items-center justify-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Go home</span>
            </Button>
          </Link>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>Error 404</p>
        </div>
      </div>
    </div>
  );
}
