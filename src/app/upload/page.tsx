"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import VideoUploadForm from "@/components/forms/VideoUploadForm";
import { createVideo } from "@/lib/actions/videos";
import { toast } from "sonner";

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleVideoUpload = async (data: {
    title: string;
    description?: string;
    videoFile: File;
  }) => {
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", data.videoFile);
      formData.append("title", data.title);
      if (data.description) {
        formData.append("description", data.description);
      }

      // Upload video using API route
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Failed to upload video");
      }

      const uploadResult = await uploadResponse.json();

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Failed to upload video");
      }

      // Create video record in database
      const result = await createVideo({
        title: data.title,
        description: data.description,
        url: uploadResult?.data?.url,
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      // Redirect to home page after successful upload
      router.push(`/`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload video. Please try again.");
    } finally {
    }
  };

  // Show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Upload Your Video
          </h1>
          <p className="mt-2 text-gray-600 text-center">
            Share your video with the world
          </p>
        </div>

        <VideoUploadForm onSubmit={handleVideoUpload} />
      </div>
    </div>
  );
}
