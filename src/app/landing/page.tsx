"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Upload, Play, Users } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Share Your Videos with the World
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload, share, and discover amazing videos. Join our community of
            creators and viewers from around the world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {session ? (
              <Link href="/upload">
                <Button size="lg" className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Upload Video</span>
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signup">
                  <Button size="lg" className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Get Started</span>
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Upload
              </h3>
              <p className="text-gray-600">
                Upload your videos with just a few clicks. Support for all major
                video formats.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                High Quality
              </h3>
              <p className="text-gray-600">
                Stream your videos in high quality with adaptive bitrate
                streaming.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Global Community
              </h3>
              <p className="text-gray-600">
                Connect with creators and viewers from around the world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
