"use server";

import { auth } from "@/auth";
import { likeVideo, dislikeVideo } from "@/lib/db/queries/videos";
import { getLikedVideosByUserId } from "@/lib/db/queries/likes";
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
    revalidatePath("/liked-videos");

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
      return { success: false, message: result.error };
    }

    // Revalidate relevant paths
    revalidatePath("/");
    revalidatePath("/liked-videos");

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

export async function getLikedVideosAction() {
  try {
    // Get user session
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required", videos: [] };
    }

    // Call the database query function
    const likedVideos = await getLikedVideosByUserId(session.user.id);

    // Transform the results to match the expected Video interface
    const videosWithUserInfo = likedVideos.map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      url: video.url,
      thumbnail: video.thumbnail,
      userId: video.userId,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
      user: {
        id: video.userId,
        name: video.userName,
        email: video.userEmail,
        image: video.userImage,
      },
      userLike: "like" as const,
      likeCount: video.likeCount,
      dislikeCount: video.dislikeCount,
      commentCount: video.commentsCount,
    }));

    return {
      success: true,
      videos: videosWithUserInfo,
      nextCursor:
        likedVideos.length > 0
          ? likedVideos[likedVideos.length - 1].createdAt
          : null,
      hasNextPage: likedVideos.length === 20,
    };
  } catch (error) {
    console.error("Get liked videos action error:", error);
    return {
      success: false,
      message: "Failed to fetch liked videos",
      videos: [],
    };
  }
}
