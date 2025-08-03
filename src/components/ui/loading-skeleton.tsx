interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({
  className = "",
  width = "w-full",
  height = "h-4",
}: SkeletonProps) {
  return (
    <div
      className={`bg-gray-200 rounded animate-pulse ${width} ${height} ${className}`}
    />
  );
}

interface VideoSkeletonProps {
  className?: string;
}

export function VideoSkeleton({ className = "" }: VideoSkeletonProps) {
  return (
    <div
      className={`relative aspect-[9/16] w-full max-h-[85vh] bg-gray-800 rounded-lg overflow-hidden ${className}`}
    >
      {/* Video placeholder */}
      <div className="w-full h-full bg-gray-700 animate-pulse" />

      {/* Play button skeleton */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white bg-opacity-20 rounded-full p-3 animate-pulse">
          <div className="w-8 h-8 bg-white bg-opacity-50 rounded" />
        </div>
      </div>

      {/* Video info skeleton */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-gray-600 rounded mb-1 animate-pulse" />
            <div className="h-3 bg-gray-600 rounded w-20 animate-pulse" />
          </div>
        </div>
        <div className="h-5 bg-gray-600 rounded mb-2 animate-pulse" />
        <div className="h-3 bg-gray-600 rounded w-3/4 animate-pulse" />
      </div>

      {/* Action buttons skeleton */}
      <div className="absolute right-4 bottom-20 flex flex-col space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-10 h-10 bg-gray-600 rounded-full animate-pulse"
          />
        ))}
      </div>

      {/* Video counter skeleton */}
      <div className="absolute top-4 right-4 bg-gray-600 px-2 py-1 rounded text-sm animate-pulse">
        <div className="h-3 w-8 bg-gray-500 rounded" />
      </div>
    </div>
  );
}

interface CardSkeletonProps {
  className?: string;
}

export function CardSkeleton({ className = "" }: CardSkeletonProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
