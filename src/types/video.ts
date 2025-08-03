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
}

export interface VideoUploadData {
  title: string;
  description?: string;
  videoFile: File;
}
