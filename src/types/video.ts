export interface Video {
  id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnail: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  userLike?: "like" | "dislike" | null;
  likeCount?: number;
  dislikeCount?: number;
}

export interface VideoUploadData {
  title: string;
  description?: string;
  videoFile: File;
}
