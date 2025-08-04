import { Skeleton } from "@/components/ui/skeleton";

export default function VideoReelSkeleton() {
  return (
    <div className="h-[calc(100vh-66px)] bg-gray-100 py-3">
      <div className="w-full rounded-2xl max-w-sm mx-auto h-full flex flex-col justify-between items-center bg-black text-white overflow-hidden relative">
        {/* Video Placeholder */}
        <Skeleton className="w-full h-full absolute top-0 left-0 z-0" />

        {/* Bottom Info Placeholder */}
        <div className="absolute bottom-5 left-4 right-4 z-10 space-y-3">
          {/* Username */}
          <Skeleton className="w-1/3 h-4 rounded-md" />

          {/* Caption lines */}
          <Skeleton className="w-3/4 h-3 rounded-md" />
          <Skeleton className="w-1/2 h-3 rounded-md" />

          {/* Audio track placeholder */}
          <Skeleton className="w-1/4 h-3 rounded-md" />
        </div>

        {/* Right-side Icons (like, comment, share) */}
        <div className="absolute right-4 bottom-20 z-10 space-y-4 flex flex-col items-center">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
