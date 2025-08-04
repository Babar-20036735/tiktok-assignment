import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    name: text("name").notNull(),
    image: text("image"),
    emailVerified: text("email_verified").default("false"),
    verificationCode: text("verification_code"),
    verificationCodeExpires: timestamp("verification_code_expires"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("email_idx").on(table.email)]
);

// Videos table
export const videos = pgTable(
  "videos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    url: text("url").notNull(),
    thumbnail: text("thumbnail"),
    duration: integer("duration"), // in seconds
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("videos_user_id_idx").on(table.userId),
    index("videos_created_at_idx").on(table.createdAt),
  ]
);

// Comments table
export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    content: text("content").notNull(),
    videoId: uuid("video_id")
      .notNull()
      .references(() => videos.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("comments_video_id_idx").on(table.videoId),
    index("comments_user_id_idx").on(table.userId),
    index("comments_created_at_idx").on(table.createdAt),
  ]
);

// Likes/Dislikes table
export const likes = pgTable(
  "likes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    videoId: uuid("video_id")
      .notNull()
      .references(() => videos.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull().$type<"like" | "dislike">(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("likes_video_id_idx").on(table.videoId),
    index("likes_user_id_idx").on(table.userId),
    unique("unique_user_video_idx").on(table.userId, table.videoId),
  ]
);

// Video views table (for analytics)
export const videoViews = pgTable(
  "video_views",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    videoId: uuid("video_id")
      .notNull()
      .references(() => videos.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }), // nullable for anonymous views
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    viewedAt: timestamp("viewed_at").defaultNow().notNull(),
  },
  (table) => [
    index("video_views_video_id_idx").on(table.videoId),
    index("video_views_user_id_idx").on(table.userId),
    index("video_views_viewed_at_idx").on(table.viewedAt),
  ]
);

// User sessions table (for tracking user activity)
export const userSessions = pgTable(
  "user_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sessionToken: text("session_token").notNull().unique(),
    expires: timestamp("expires").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("user_sessions_user_id_idx").on(table.userId),
    index("user_sessions_token_idx").on(table.sessionToken),
  ]
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  videos: many(videos),
  comments: many(comments),
  likes: many(likes),
  sessions: many(userSessions),
}));

export const videosRelations = relations(videos, ({ one, many }) => ({
  user: one(users, {
    fields: [videos.userId],
    references: [users.id],
  }),
  comments: many(comments),
  likes: many(likes),
  views: many(videoViews),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  video: one(videos, {
    fields: [comments.videoId],
    references: [videos.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  replies: many(comments),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  video: one(videos, {
    fields: [likes.videoId],
    references: [videos.id],
  }),
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}));

export const videoViewsRelations = relations(videoViews, ({ one }) => ({
  video: one(videos, {
    fields: [videoViews.videoId],
    references: [videos.id],
  }),
  user: one(users, {
    fields: [videoViews.userId],
    references: [users.id],
  }),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}));
