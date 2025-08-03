import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: string;
}

export async function uploadVideo(file: File): Promise<UploadResult> {
  try {
    // Convert File to base64 for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64String}`;

    // Upload to Cloudinary
    const result = await new Promise<UploadResult>((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          resource_type: "video",
          folder: "videos",
          allowed_formats: ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"],
          transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as UploadResult);
          }
        }
      );
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload video to Cloudinary");
  }
}

export async function deleteVideo(publicId: string): Promise<void> {
  try {
    await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        { resource_type: "video" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete video from Cloudinary");
  }
}
