"use server";

import { auth } from "@/auth";
import { likeVideo, dislikeVideo } from "@/lib/db/queries/videos";
import { revalidatePath } from "next/cache";

export async function likeVideoAction(videoId: string) {
  try {
    // Get user session
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }

    // Validate videoId
    if (!videoId || typeof videoId !== "string") {
      return { success: false, message: "Invalid video ID" };
    }

    // Call the database function
    const result = await likeVideo(videoId, session.user.id);

    if (result.error) {
      return { success: false, message: result.error };
    }

    // Revalidate relevant paths
    revalidatePath("/");

    return {
      success: true,
      message: "Video liked successfully",
      action: result.action,
      type: result.type,
    };
  } catch (error) {
    console.error("Like video action error:", error);
    return { success: false, message: "Internal server error" };
  }
}

export async function dislikeVideoAction(videoId: string) {
  try {
    // Get user session
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }

    // Validate videoId
    if (!videoId || typeof videoId !== "string") {
      return { success: false, message: "Invalid video ID" };
    }

    // Call the database function
    const result = await dislikeVideo(videoId, session.user.id);

    if (result.error) {
      return { error: result.error };
    }

    // Revalidate relevant paths
    revalidatePath("/");

    return {
      success: true,
      action: result.action,
      type: result.type,
    };
  } catch (error) {
    console.error("Dislike video action error:", error);
    return { success: false, message: "Internal server error" };
  }
}
