import { getVideosByUserId } from "@/lib/actions/videos";
import { Button } from "@/components/ui/button";
import { Play, User } from "lucide-react";
import Link from "next/link";
import VideosTable from "@/components/video/VideosTable";

export default async function VideosManagementPage() {
  const result = await getVideosByUserId();
  if (!result.success) {
    throw new Error(result.message);
  }
  const videos = result.videos || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Videos</h1>
          <p className="text-gray-600">
            Manage your uploaded videos. You can view details and delete videos
            you no longer want.
          </p>
        </div>

        {/* Videos Table */}
        {videos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Play className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No videos yet
            </h3>
            <p className="text-gray-500 mb-4">
              You haven&apos;t uploaded any videos yet. Start sharing your
              content!
            </p>
            <Button asChild>
              <Link href="/upload">Upload Your First Video</Link>
            </Button>
          </div>
        ) : (
          <VideosTable videos={videos} />
        )}

        {/* Stats */}
        {videos.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  Total videos:{" "}
                  <span className="font-medium">{videos.length}</span>
                </span>
              </div>
              <Button asChild>
                <Link href="/upload">Upload New Video</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
