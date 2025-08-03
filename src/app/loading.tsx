import { VideoSkeleton } from "@/components/ui/loading-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black">
      <div className="h-screen flex items-center justify-center">
        <div className="w-full max-w-sm mx-auto px-4">
          <VideoSkeleton />
        </div>
      </div>
    </div>
  );
}
