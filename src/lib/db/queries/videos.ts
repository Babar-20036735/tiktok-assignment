import { db } from "@/lib/db";
import { comments, likes, videoViews, videos } from "@/lib/db/schema";
import { and, count, desc, eq, sql } from "drizzle-orm";

export const getVideos = async (limit = 20, offset = 0, userId?: string) => {
  const videoList = await db.query.videos.findMany({
    with: {
      user: true,
    },
    orderBy: [desc(videos.createdAt)],
    limit,
    offset,
  });

  // If userId is provided, get like status for each video
  if (userId) {
    const videosWithLikes = await Promise.all(
      videoList.map(async (video) => {
        const userLike = await getUserLikeByVideoId(video.id, userId);
        const likeStats = await getLikesByVideoId(video.id);

        return {
          ...video,
          userLike: userLike?.type || null,
          likeCount: likeStats.likes,
          dislikeCount: likeStats.dislikes,
        };
      })
    );
    return videosWithLikes;
  }

  return videoList;
};

export const getVideoById = async (id: string) => {
  return await db.query.videos.findFirst({
    where: eq(videos.id, id),
    with: {
      user: true,
    },
  });
};

export const getVideosByUserId = async (
  userId: string,
  limit = 20,
  offset = 0
) => {
  return await db.query.videos.findMany({
    where: eq(videos.userId, userId),
    orderBy: [desc(videos.createdAt)],
    limit,
    offset,
  });
};

// View queries
export const getVideoViews = async (videoId: string) => {
  const result = await db
    .select({ count: count() })
    .from(videoViews)
    .where(eq(videoViews.videoId, videoId));

  return result[0]?.count || 0;
};

// Analytics queries
export const getVideoStats = async (videoId: string) => {
  const [likesResult, dislikesResult, viewsResult, commentsResult] =
    await Promise.all([
      db
        .select({ count: count() })
        .from(likes)
        .where(and(eq(likes.videoId, videoId), eq(likes.type, "like"))),
      db
        .select({ count: count() })
        .from(likes)
        .where(and(eq(likes.videoId, videoId), eq(likes.type, "dislike"))),
      db
        .select({ count: count() })
        .from(videoViews)
        .where(eq(videoViews.videoId, videoId)),
      db
        .select({ count: count() })
        .from(comments)
        .where(eq(comments.videoId, videoId)),
    ]);

  return {
    likes: likesResult[0]?.count || 0,
    dislikes: dislikesResult[0]?.count || 0,
    views: viewsResult[0]?.count || 0,
    comments: commentsResult[0]?.count || 0,
  };
};

// Search queries
export const searchVideos = async (query: string, limit = 20, offset = 0) => {
  return await db.query.videos.findMany({
    where: sql`${videos.title} ILIKE ${`%${query}%`} OR ${
      videos.description
    } ILIKE ${`%${query}%`}`,
    with: {
      user: true,
    },
    orderBy: [desc(videos.createdAt)],
    limit,
    offset,
  });
};

// Comment queries
export const getCommentsByVideoId = async (
  videoId: string,
  limit = 50,
  offset = 0
) => {
  return await db.query.comments.findMany({
    where: eq(comments.videoId, videoId),
    with: {
      user: true,
      replies: {
        with: {
          user: true,
        },
      },
    },
    orderBy: [desc(comments.createdAt)],
    limit,
    offset,
  });
};

// Like queries
export const getLikesByVideoId = async (videoId: string) => {
  const likesCount = await db
    .select({ count: count() })
    .from(likes)
    .where(and(eq(likes.videoId, videoId), eq(likes.type, "like")));

  const dislikesCount = await db
    .select({ count: count() })
    .from(likes)
    .where(and(eq(likes.videoId, videoId), eq(likes.type, "dislike")));

  return {
    likes: likesCount[0]?.count || 0,
    dislikes: dislikesCount[0]?.count || 0,
  };
};

export const getUserLikeByVideoId = async (videoId: string, userId: string) => {
  return await db.query.likes.findFirst({
    where: and(eq(likes.videoId, videoId), eq(likes.userId, userId)),
  });
};

// Like/Dislike actions
export const likeVideo = async (videoId: string, userId: string) => {
  try {
    // Check if video exists
    const video = await getVideoById(videoId);
    if (!video) {
      return { error: "Video not found" };
    }

    // Check if user already liked/disliked this video
    const existingLike = await getUserLikeByVideoId(videoId, userId);

    if (existingLike) {
      if (existingLike.type === "like") {
        // Remove like
        await db.delete(likes).where(eq(likes.id, existingLike.id));
        return { success: true, action: "removed", type: "like" };
      } else {
        // Change dislike to like
        await db
          .update(likes)
          .set({ type: "like" })
          .where(eq(likes.id, existingLike.id));
        return { success: true, action: "changed", type: "like" };
      }
    } else {
      // Create new like
      await db.insert(likes).values({
        videoId,
        userId,
        type: "like",
      });
      return { success: true, action: "added", type: "like" };
    }
  } catch (error) {
    console.error("Like video error:", error);
    return { error: "Failed to like video" };
  }
};

export const dislikeVideo = async (videoId: string, userId: string) => {
  try {
    // Check if video exists
    const video = await getVideoById(videoId);
    if (!video) {
      return { error: "Video not found" };
    }

    // Check if user already liked/disliked this video
    const existingLike = await getUserLikeByVideoId(videoId, userId);

    if (existingLike) {
      if (existingLike.type === "dislike") {
        // Remove dislike
        await db.delete(likes).where(eq(likes.id, existingLike.id));
        return { success: true, action: "removed", type: "dislike" };
      } else {
        // Change like to dislike
        await db
          .update(likes)
          .set({ type: "dislike" })
          .where(eq(likes.id, existingLike.id));
        return { success: true, action: "changed", type: "dislike" };
      }
    } else {
      // Create new dislike
      await db.insert(likes).values({
        videoId,
        userId,
        type: "dislike",
      });
      return { success: true, action: "added", type: "dislike" };
    }
  } catch (error) {
    console.error("Dislike video error:", error);
    return { error: "Failed to dislike video" };
  }
};
