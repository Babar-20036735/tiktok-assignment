"use server";

import { db } from "@/lib/db";
import { videos } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getVideos as getVideosQuery } from "@/lib/db/queries/videos";
import { auth } from "@/auth";

export async function createVideo({
  title,
  description,
  url,
  thumbnail,
}: {
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
}) {
  try {
    if (!title || !url) {
      return { success: false, message: "Title and URL are required" };
    }

    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }

    const [newVideo] = await db
      .insert(videos)
      .values({
        title,
        description: description || null,
        url,
        thumbnail: thumbnail || null,
        userId: session.user.id,
      })
      .returning();

    revalidatePath("/");

    return {
      success: true,
      message: "Video created successfully",
      video: {
        id: newVideo.id,
        title: newVideo.title,
        description: newVideo.description,
        url: newVideo.url,
        thumbnail: newVideo.thumbnail,
        userId: newVideo.userId,
        createdAt: newVideo.createdAt,
        updatedAt: newVideo.updatedAt,
      },
    };
  } catch (error) {
    console.error("Create video error:", error);
    return { success: false, message: "Failed to create video" };
  }
}

export async function getVideoById(id: string) {
  try {
    const video = await db.query.videos.findFirst({
      where: eq(videos.id, id),
      with: {
        user: true,
      },
    });

    if (!video) {
      return { success: false, message: "Video not found" };
    }

    return { success: true, video };
  } catch (error) {
    console.error("Get video by ID error:", error);
    return { success: false, message: "Failed to fetch video" };
  }
}

export async function getVideosByUserId(userId: string) {
  try {
    const userVideos = await db.query.videos.findMany({
      where: eq(videos.userId, userId),
      with: {
        user: true,
      },
      orderBy: [desc(videos.createdAt)],
    });

    return { success: true, videos: userVideos };
  } catch (error) {
    console.error("Get videos by user ID error:", error);
    return { success: false, message: "Failed to fetch user videos" };
  }
}

export async function updateVideo(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const url = formData.get("url") as string;
    const thumbnail = formData.get("thumbnail") as string;

    if (!title || !url) {
      return { success: false, message: "Title and URL are required" };
    }

    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }

    // Check if user owns the video
    const existingVideo = await db.query.videos.findFirst({
      where: eq(videos.id, id),
    });

    if (!existingVideo) {
      return { success: false, message: "Video not found" };
    }

    if (existingVideo.userId !== session.user.id) {
      return { success: false, message: "Unauthorized to update this video" };
    }

    await db
      .update(videos)
      .set({
        title,
        description: description || null,
        url,
        thumbnail: thumbnail || null,
      })
      .where(eq(videos.id, id));

    revalidatePath("/");

    return { success: true, message: "Video updated successfully" };
  } catch (error) {
    console.error("Update video error:", error);
    return { success: false, message: "Failed to update video" };
  }
}

export async function deleteVideo(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }

    // Check if user owns the video
    const existingVideo = await db.query.videos.findFirst({
      where: eq(videos.id, id),
    });

    if (!existingVideo) {
      return { success: false, message: "Video not found" };
    }

    if (existingVideo.userId !== session.user.id) {
      return { success: false, message: "Unauthorized to delete this video" };
    }

    await db.delete(videos).where(eq(videos.id, id));

    revalidatePath("/");

    return { success: true, message: "Video deleted successfully" };
  } catch (error) {
    console.error("Delete video error:", error);
    return { success: false, message: "Failed to delete video" };
  }
}

export async function getVideos(limit = 20, cursor?: Date) {
  try {
    // Get user session
    const session = await auth();
    const userId = session?.user?.id;

    const result = await getVideosQuery({ limit, cursor, userId });

    return {
      success: true,
      videos: result.videos,
      nextCursor: result.nextCursor,
      hasNextPage: result.hasNextPage,
    };
  } catch (error) {
    console.error("Get videos error:", error);
    return {
      success: false,
      message: "Internal server error",
      videos: [],
      nextCursor: null,
      hasNextPage: false,
    };
  }
}
