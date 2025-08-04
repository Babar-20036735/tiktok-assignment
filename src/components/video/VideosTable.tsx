"use client";

interface UserVideo {
  id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnail: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}
import { Button } from "@/components/ui/button";
import { Trash2, Play, Calendar } from "lucide-react";
import { deleteVideo } from "@/lib/actions/videos";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

export default function VideosTable({ videos }: { videos: UserVideo[] }) {
  const [videosList, setVideos] = useState<UserVideo[]>(videos);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Video
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uploaded
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {videosList.map((video) => (
              <TableRow key={video.id} video={video} setVideos={setVideos} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TableRow({
  video,
  setVideos,
}: {
  video: UserVideo;
  setVideos: React.Dispatch<React.SetStateAction<UserVideo[]>>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteVideo = async (videoId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this video? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      const result = await deleteVideo(videoId);

      if (result.success) {
        setVideos((prev) => prev.filter((video) => video.id !== videoId));
        toast.success("Video deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete video");
      }
    } catch (error) {
      console.error("Delete video error:", error);
      toast.error("Failed to delete video");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      {/* Video Thumbnail */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-16 w-16">
            {video.thumbnail ? (
              <Image
                className="h-16 w-16 rounded-lg object-cover"
                src={video.thumbnail}
                alt={video.title}
                width={64}
                height={64}
              />
            ) : (
              <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <Play className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Title */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{video.title}</div>
      </td>

      {/* Description */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-500 max-w-xs truncate">
          {video.description || "No description"}
        </div>
      </td>

      {/* Upload Date */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          {formatDate(video.createdAt)}
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <a href={video.url} target="_blank" rel="noopener noreferrer">
              <Play className="h-4 w-4 mr-1" />
              View
            </a>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteVideo(video.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </>
            )}
          </Button>
        </div>
      </td>
    </tr>
  );
}
