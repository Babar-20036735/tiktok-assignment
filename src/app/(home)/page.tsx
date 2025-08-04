import VideoFeed from "@/components/video/VideoFeed";
import { getVideos } from "@/lib/actions/videos";
import { auth } from "@/auth";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default async function HomePage() {
  const session = await auth();
  const result = await getVideos();

  if (!result.success) {
    throw new Error(result.message);
  }

  const { videos, nextCursor, hasNextPage } = result;

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
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No videos yet
            </h3>
            <p className="text-gray-500">
              Be the first to upload a video and share it with the world!
            </p>
            {session && (
              <div className="mt-4">
                <Link
                  href="/upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Upload Your First Video
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <VideoFeed
          videos={videos}
          nextCursor={nextCursor}
          hasNextPage={hasNextPage}
        />
      )}
    </div>
  );
}
