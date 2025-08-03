"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
} from "lucide-react";
import LoginDialog from "@/components/auth/LoginDialog";
import { Video } from "@/types/video";
import { likeVideoAction, dislikeVideoAction } from "@/lib/actions/likes";
import { toast } from "sonner";
import { formatTimeAgo } from "@/lib/utils";

interface VideoCardProps {
  video: Video;
  onVideoEnd: () => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  currentIndex: number;
  totalVideos: number;
  isActive?: boolean;
  isScrolling?: boolean;
}

export default function VideoCard({
  video,
  onVideoEnd,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  currentIndex,
  totalVideos,
  isActive = true,
  isScrolling = false,
}: VideoCardProps) {
  const { data: session } = useSession();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [liked, setLiked] = useState(video.userLike === "like");
  const [disliked, setDisliked] = useState(video.userLike === "dislike");
  const [likeCount, setLikeCount] = useState(video.likeCount || 0);
  const [dislikeCount, setDislikeCount] = useState(video.dislikeCount || 0);
  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isDislikeLoading, setIsDislikeLoading] = useState(false);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    onVideoEnd();
  };

  // Auto-play when video becomes active
  useEffect(() => {
    if (isActive && videoRef.current && !isScrolling) {
      videoRef.current.play().catch(() => {
        // Auto-play might be blocked by browser
        console.log("Auto-play blocked by browser");
      });
      setIsPlaying(true);
    } else if (!isActive && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, isScrolling]);

  const handleLike = async () => {
    if (!session) {
      setShowLoginDialog(true);
      return;
    }

    if (isLikeLoading) return;

    setIsLikeLoading(true);
    try {
      const result = await likeVideoAction(video.id);

      if (result.success) {
        if (result.action === "added" || result.action === "changed") {
          setLiked(true);
          setDisliked(false);
          setLikeCount((prev) => prev + 1);
          if (disliked) {
            setDislikeCount((prev) => prev - 1);
          }
        } else if (result.action === "removed") {
          setLiked(false);
          setLikeCount((prev) => prev - 1);
        }
      } else {
        console.error("Like error:", result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Like video error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!session) {
      setShowLoginDialog(true);
      return;
    }

    if (isDislikeLoading) return;

    setIsDislikeLoading(true);
    try {
      const result = await dislikeVideoAction(video.id);

      if (result.success) {
        if (result.action === "added" || result.action === "changed") {
          setDisliked(true);
          setLiked(false);
          setDislikeCount((prev) => prev + 1);
          if (liked) {
            setLikeCount((prev) => prev - 1);
          }
        } else if (result.action === "removed") {
          setDisliked(false);
          setDislikeCount((prev) => prev - 1);
        }
      } else {
        console.error("Dislike error:", result.error);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Dislike video error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsDislikeLoading(false);
    }
  };

  const handleComment = () => {
    if (!session) {
      setShowLoginDialog(true);
      return;
    }

    setShowComments(!showComments);
  };

  return (
    <div className="h-full relative rounded-lg overflow-hidden shadow-lg">
      {/* Video Player */}
      <div className="relative aspect-[9/16] w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={video.url}
          poster={video.thumbnail || undefined}
          onEnded={handleVideoEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          loop
        />

        {/* Play/Pause Overlay */}
        <button
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-opacity-30 hover:bg-opacity-50 transition-opacity"
        >
          {!isPlaying && (
            <div className="bg-white bg-opacity-80 rounded-full p-3">
              <Play className="h-8 w-8 text-black" fill="black" />
            </div>
          )}
        </button>

        {/* Navigation Controls */}
        {/* <div className="absolute inset-y-0 left-0 flex items-center">
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="p-2 bg-black bg-opacity-50 text-white rounded-r-lg disabled:opacity-50"
          >
            <ChevronUp className="h-6 w-6" />
          </button>
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="p-2 bg-black bg-opacity-50 text-white rounded-l-lg disabled:opacity-50"
          >
            <ChevronDown className="h-6 w-6" />
          </button>
        </div> */}

        {/* Video Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3 pb-4">
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-700">
                {video.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                {video.user.name}
              </p>
              <p className="text-gray-300 text-xs">
                {formatTimeAgo(video.createdAt)}
              </p>
            </div>
          </div>

          <h3 className="text-white text-sm font-semibold mb-1">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-gray-300 text-xs line-clamp-1">
              {video.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute right-3 bottom-20 flex flex-col space-y-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isLikeLoading}
            className={`p-1.5 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 ${
              liked ? "text-red-500" : ""
            } ${isLikeLoading ? "opacity-50" : ""}`}
          >
            <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDislike}
            disabled={isDislikeLoading}
            className={`p-1.5 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 ${
              disliked ? "text-blue-500" : ""
            } ${isDislikeLoading ? "opacity-50" : ""}`}
          >
            <ThumbsDown
              className={`h-5 w-5 ${disliked ? "fill-current" : ""}`}
            />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleComment}
            className="p-1.5 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>

        {/* Video Counter */}
        <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {currentIndex} / {totalVideos}
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="bg-white p-4 max-h-64 overflow-y-auto">
          <h4 className="font-semibold mb-3">Comments</h4>
          <div className="text-center text-gray-500">
            <p>Comments feature coming soon!</p>
          </div>
        </div>
      )}

      {/* Login Dialog */}
      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />
    </div>
  );
}
