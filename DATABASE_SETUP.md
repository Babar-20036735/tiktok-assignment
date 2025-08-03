# Database Setup Guide

## Overview

This project uses **Drizzle ORM** with **NeonDB (PostgreSQL)** for the database layer.

## Database Schema

### Tables

#### 1. `users`

- **id**: UUID (Primary Key)
- **email**: Text (Unique)
- **name**: Text
- **image**: Text (Optional)
- **createdAt**: Timestamp
- **updatedAt**: Timestamp

#### 2. `videos`

- **id**: UUID (Primary Key)
- **title**: Text
- **description**: Text (Optional)
- **url**: Text (Video file URL)
- **thumbnail**: Text (Optional)
- **duration**: Integer (in seconds)
- **userId**: UUID (Foreign Key to users)
- **createdAt**: Timestamp
- **updatedAt**: Timestamp

#### 3. `comments`

- **id**: UUID (Primary Key)
- **content**: Text
- **videoId**: UUID (Foreign Key to videos)
- **userId**: UUID (Foreign Key to users)
- **createdAt**: Timestamp
- **updatedAt**: Timestamp

#### 4. `likes`

- **id**: UUID (Primary Key)
- **videoId**: UUID (Foreign Key to videos)
- **userId**: UUID (Foreign Key to users)
- **type**: Text ('like' | 'dislike')
- **createdAt**: Timestamp

#### 5. `video_views`

- **id**: UUID (Primary Key)
- **videoId**: UUID (Foreign Key to videos)
- **userId**: UUID (Optional, for anonymous views)
- **ipAddress**: Text
- **userAgent**: Text
- **viewedAt**: Timestamp

#### 6. `user_sessions`

- **id**: UUID (Primary Key)
- **userId**: UUID (Foreign Key to users)
- **sessionToken**: Text (Unique)
- **expires**: Timestamp
- **createdAt**: Timestamp

## Indexes

### Performance Indexes

- `email_idx`: On users.email
- `videos_user_id_idx`: On videos.userId
- `videos_created_at_idx`: On videos.createdAt
- `comments_video_id_idx`: On comments.videoId
- `comments_user_id_idx`: On comments.userId
- `comments_created_at_idx`: On comments.createdAt
- `likes_video_id_idx`: On likes.videoId
- `likes_user_id_idx`: On likes.userId
- `unique_user_video_idx`: Unique index on (likes.userId, likes.videoId)
- `video_views_video_id_idx`: On videoViews.videoId
- `video_views_user_id_idx`: On videoViews.userId
- `video_views_viewed_at_idx`: On videoViews.viewedAt
- `user_sessions_user_id_idx`: On userSessions.userId
- `user_sessions_token_idx`: On userSessions.sessionToken

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with:

```env
DATABASE_URL=""
```

### 2. Database Commands

```bash
# Generate migration files
npm run db:generate

# Push schema to database
npm run db:push

# Run migrations
npm run db:migrate

# Open Drizzle Studio
npm run db:studio
```

### 3. NeonDB Setup

1. Create a NeonDB account at https://neon.tech
2. Create a new project
3. Copy the connection string
4. Add it to your `.env.local` file

## Relations

### One-to-Many

- User → Videos
- User → Comments
- User → Likes
- User → Sessions
- Video → Comments
- Video → Likes
- Video → Views
- Comment → Replies (self-referencing)

### Many-to-One

- Video → User
- Comment → User
- Comment → Video
- Like → User
- Like → Video
- View → User
- View → Video
- Session → User

## Features Supported

### Core Features

- ✅ User authentication and sessions
- ✅ Video upload and management
- ✅ Comments with nested replies
- ✅ Like/dislike system
- ✅ Video view tracking
- ✅ User analytics

### Performance Features

- ✅ Optimized indexes for common queries
- ✅ Efficient pagination support
- ✅ Full-text search capabilities
- ✅ Real-time statistics

### Security Features

- ✅ Foreign key constraints
- ✅ Cascade deletes
- ✅ Unique constraints
- ✅ Data validation
