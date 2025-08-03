"use server";

import { uploadVideo } from "@/lib/cloudinary";

export async function uploadVideoToCloudinary(file: File) {
  try {
    const result = await uploadVideo(file);
    return {
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
      },
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload video",
    };
  }
}
