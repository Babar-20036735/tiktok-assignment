import { getLikedVideosAction } from "@/lib/actions/likes";
import VideoFeed from "@/components/video/VideoFeed";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

export default async function LikedVideosPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const result = await getLikedVideosAction();

  if (!result.success) {
    throw new Error(result?.message);
  }

  const videos = result?.videos || [];

  return (
    <div className="h-[calc(100vh-66px)] bg-gray-100 py-3">
      {videos.length === 0 ? (
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-4">
            <div className="text-gray-500 mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No liked videos yet
            </h3>
            <p className="text-gray-500">
              Start exploring videos and like the ones you enjoy!
            </p>
            <div className="mt-4">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Explore Videos
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <Suspense fallback={<></>}>
          <VideoFeed videos={videos} />
        </Suspense>
      )}
    </div>
  );
}
