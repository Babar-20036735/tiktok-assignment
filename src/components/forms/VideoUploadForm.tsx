"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Upload, X, CheckCircle } from "lucide-react";

const videoUploadSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  videoFile: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Video file is required")
    .refine(
      (file) => file.size <= 100 * 1024 * 1024, // 100MB limit
      "Video file must be less than 100MB"
    ),
});

type VideoUploadFormData = z.infer<typeof videoUploadSchema>;

interface VideoUploadFormProps {
  onSubmit: (data: VideoUploadFormData) => Promise<void>;
}

export default function VideoUploadForm({ onSubmit }: VideoUploadFormProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<VideoUploadFormData>({
    resolver: zodResolver(videoUploadSchema),
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        setSelectedFile(file);
        setValue("videoFile", file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setValue("videoFile", file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setValue("videoFile", null as unknown as File);
  };

  const onFormSubmit = async (data: VideoUploadFormData) => {
    try {
      setIsUploading(true);
      await onSubmit(data);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload Video</h2>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Video File Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Video File *
          </label>

          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <span className="text-lg font-medium text-gray-900">
                    {selectedFile.name}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeFile}
                  className="flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Remove File</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop your video here
                  </p>
                  <p className="text-sm text-gray-500">
                    or click to browse files
                  </p>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload">
                  <Button type="button" variant="outline" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
              </div>
            )}
          </div>

          {errors.videoFile && (
            <p className="text-sm text-red-600">{errors.videoFile.message}</p>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            {...register("title")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter video title"
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter video description (optional)"
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isUploading || !selectedFile}
          className="w-full"
        >
          {isUploading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Uploading video...</span>
            </div>
          ) : (
            "Upload Video"
          )}
        </Button>
      </form>
    </div>
  );
}
