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
  duration,
  userId,
}: {
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  duration?: number;
  userId: string;
}) {
  try {
    if (!title || !url || !userId) {
      return { error: "Title, URL, and user ID are required" };
    }

    const newVideo = await db
      .insert(videos)
      .values({
        title,
        description,
        url,
        thumbnail,
        duration,
        userId,
      })
      .returning();

    revalidatePath("/");
    revalidatePath(`/user/${userId}`);

    return {
      success: true,
      video: newVideo[0],
    };
  } catch (error) {
    console.error("Create video error:", error);
    return { error: "Internal server error" };
  }
}

export async function getVideos(limit = 20, offset = 0) {
  try {
    // Get user session
    const session = await auth();
    const userId = session?.user?.id;

    const videoList = await getVideosQuery(limit, offset, userId);

    return {
      success: true,
      videos: videoList,
    };
  } catch (error) {
    console.error("Get videos error:", error);
    return { success: false, message: "Internal server error", videos: [] };
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
      return { error: "Video not found" };
    }

    return {
      success: true,
      video,
    };
  } catch (error) {
    console.error("Get video error:", error);
    return { error: "Internal server error" };
  }
}

export async function getVideosByUserId(
  userId: string,
  limit = 20,
  offset = 0
) {
  try {
    const userVideos = await db.query.videos.findMany({
      where: eq(videos.userId, userId),
      orderBy: [desc(videos.createdAt)],
      limit,
      offset,
    });

    return {
      success: true,
      videos: userVideos,
    };
  } catch (error) {
    console.error("Get user videos error:", error);
    return { error: "Internal server error" };
  }
}

export async function updateVideo({
  id,
  title,
  description,
  thumbnail,
}: {
  id: string;
  title?: string;
  description?: string;
  thumbnail?: string;
}) {
  try {
    const updateData: any = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (thumbnail) updateData.thumbnail = thumbnail;

    const updatedVideo = await db
      .update(videos)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(videos.id, id))
      .returning();

    if (updatedVideo.length === 0) {
      return { error: "Video not found" };
    }

    revalidatePath(`/video/${id}`);
    revalidatePath("/");

    return {
      success: true,
      video: updatedVideo[0],
    };
  } catch (error) {
    console.error("Update video error:", error);
    return { error: "Internal server error" };
  }
}

export async function deleteVideo(id: string, userId: string) {
  try {
    // Check if video belongs to user
    const video = await db.query.videos.findFirst({
      where: eq(videos.id, id),
    });

    if (!video) {
      return { error: "Video not found" };
    }

    if (video.userId !== userId) {
      return { error: "Unauthorized to delete this video" };
    }

    await db.delete(videos).where(eq(videos.id, id));

    revalidatePath("/");
    revalidatePath(`/user/${userId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete video error:", error);
    return { error: "Internal server error" };
  }
}
