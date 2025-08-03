export default function UploadLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>

        {/* Upload Form Skeleton */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* File Upload Area */}
          <div className="mb-6">
            <div className="h-4 bg-gray-200 rounded w-24 mb-3 animate-pulse" />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full mb-4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto mb-2 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-32 mx-auto animate-pulse" />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Title Field */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Description Field */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
              <div className="h-24 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Thumbnail Preview */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
              <div className="aspect-video bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Upload Progress */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <div className="h-10 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
