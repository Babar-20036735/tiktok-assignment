"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Upload, User, LogOut, Heart } from "lucide-react";

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              VideoPlatform
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/upload">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </Button>
                </Link>

                <Link href="/liked-videos">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Heart className="h-4 w-4" />
                    <span>Liked</span>
                  </Button>
                </Link>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    Welcome, {session.user?.name}
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
