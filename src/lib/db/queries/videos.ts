import { db } from "@/lib/db";
import { comments, likes, videoViews, videos } from "@/lib/db/schema";
import { and, count, desc, eq, sql } from "drizzle-orm";

export const getVideos = async (limit = 20, offset = 0) => {
  return await db.query.videos.findMany({
    with: {
      user: true,
    },
    orderBy: [desc(videos.createdAt)],
    limit,
    offset,
  });
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
