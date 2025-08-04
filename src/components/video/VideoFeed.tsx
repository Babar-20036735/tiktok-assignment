"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VideoCard from "./VideoCard";
import { Video } from "@/types/video";
import { getVideos } from "@/lib/actions/videos";
import { toast } from "sonner";

interface VideoFeedProps {
  videos: Video[];
  nextCursor?: Date | null;
  hasNextPage?: boolean;
}

export default function VideoFeed({
  videos: initialVideos,
  nextCursor: initialNextCursor,
  hasNextPage: initialHasNextPage,
}: VideoFeedProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [nextCursor, setNextCursor] = useState<Date | null>(
    initialNextCursor || null
  );
  const [hasNextPage, setHasNextPage] = useState<boolean>(
    initialHasNextPage || false
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize video refs array
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videos.length);
  }, [videos.length]);

  // Load more videos function
  const loadMoreVideos = useCallback(async () => {
    if (!hasNextPage || isLoadingMore || !nextCursor) return;

    setIsLoadingMore(true);
    try {
      const result = await getVideos(20, nextCursor);

      if (result.success && result.videos.length > 0) {
        setVideos((prev) => [...prev, ...result.videos]);
        setNextCursor(result.nextCursor);
        setHasNextPage(result.hasNextPage || false);

        // Update URL with new cursor
        const params = new URLSearchParams(searchParams);
        if (result.nextCursor) {
          params.set("cursor", result.nextCursor.toISOString());
        } else {
          params.delete("cursor");
        }
        router.replace(`/?${params.toString()}`, { scroll: false });
      }
    } catch (error) {
      toast.error("Failed to load more videos");
      console.error("Load more videos error:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasNextPage, isLoadingMore, nextCursor, router, searchParams]);

  // Check if we need to load more videos when user reaches near the end
  const checkForMoreVideos = useCallback(() => {
    if (
      currentVideoIndex >= videos.length - 3 &&
      hasNextPage &&
      !isLoadingMore
    ) {
      loadMoreVideos();
    }
  }, [
    currentVideoIndex,
    videos.length,
    hasNextPage,
    isLoadingMore,
    loadMoreVideos,
  ]);

  const scrollToVideo = useCallback((index: number) => {
    if (videoRefs.current[index] && containerRef.current) {
      videoRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setCurrentVideoIndex(index);
    }
  }, []);

  const handleVideoEnd = useCallback(() => {
    if (currentVideoIndex < videos.length - 1) {
      scrollToVideo(currentVideoIndex + 1);
    }
  }, [currentVideoIndex, videos.length, scrollToVideo]);

  const handleVideoPrevious = useCallback(() => {
    if (currentVideoIndex > 0) {
      scrollToVideo(currentVideoIndex - 1);
    }
  }, [currentVideoIndex, scrollToVideo]);

  const handleVideoNext = useCallback(() => {
    if (currentVideoIndex < videos.length - 1) {
      scrollToVideo(currentVideoIndex + 1);
    }
    // Check if we need to load more videos
    checkForMoreVideos();
  }, [currentVideoIndex, videos.length, scrollToVideo, checkForMoreVideos]);

  // Intersection Observer for auto-play
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const videoIndex = parseInt(
              entry.target.getAttribute("data-video-index") || "0"
            );
            setCurrentVideoIndex(videoIndex);
          }
        });
      },
      {
        root: containerRef.current,
        rootMargin: "-10% 0px -10% 0px", // Trigger when video is 80% in view
        threshold: 0.5,
      }
    );

    videoRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, [videos.length]);

  // Handle scroll events for snapping
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
        // Find the video closest to the center of the viewport
        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.top + containerRect.height / 2;

        let closestVideo = 0;
        let minDistance = Infinity;

        videoRefs.current.forEach((ref, index) => {
          if (ref) {
            const rect = ref.getBoundingClientRect();
            const videoCenter = rect.top + rect.height / 2;
            const distance = Math.abs(containerCenter - videoCenter);

            if (distance < minDistance) {
              minDistance = distance;
              closestVideo = index;
            }
          }
        });

        setCurrentVideoIndex(closestVideo);
        // Check if we need to load more videos
        checkForMoreVideos();
      }, 150); // Debounce scroll events
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [checkForMoreVideos]);

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No videos available</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {videos.map((video, index) => (
        <div
          key={video.id}
          ref={(el) => {
            videoRefs.current[index] = el;
          }}
          data-video-index={index}
          className="h-full snap-start snap-always flex items-center justify-center"
        >
          <div className="h-full w-full max-w-sm mx-auto px-4">
            <VideoCard
              video={video}
              onVideoEnd={handleVideoEnd}
              onPrevious={handleVideoPrevious}
              onNext={handleVideoNext}
              canGoPrevious={index > 0}
              canGoNext={index < videos.length - 1}
              currentIndex={index + 1}
              totalVideos={videos.length}
              isActive={currentVideoIndex === index}
              isScrolling={isScrolling}
            />
          </div>
        </div>
      ))}

      {/* Loading indicator */}
      {isLoadingMore && (
        <div className="h-full snap-start snap-always flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Loading more videos...</p>
          </div>
        </div>
      )}
    </div>
  );
}
