"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import { Comment } from "@/types/comment";
import {
  getCommentsAction,
  createCommentAction,
  deleteCommentAction,
} from "@/lib/actions/comments";
import { toast } from "sonner";
import { formatTimeAgo } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface CommentsSheetProps {
  videoId: string;
  videoTitle: string;
}

export default function CommentsSheet({ videoId }: CommentsSheetProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const result = await getCommentsAction(videoId);
      if (result.success) {
        setComments(result.comments || []);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Fetch comments error:", error);
      toast.error("Failed to fetch comments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, videoId]);

  const handleSubmitComment = async () => {
    if (!session) {
      toast.error("Please login to comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createCommentAction(videoId, newComment);
      if (result.success) {
        setNewComment("");
        toast.success("Comment posted successfully");
        // Refresh comments
        fetchComments();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Submit comment error:", error);
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setIsDeleting(commentId);
    try {
      const result = await deleteCommentAction(commentId);
      if (result.success) {
        toast.success("Comment deleted successfully");
        // Remove comment from state
        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentId)
        );
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Delete comment error:", error);
      toast.error("Failed to delete comment");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-1.5 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="px-6">
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full px-6 pb-6">
          {/* Comments List */}
          <div className="flex-1 overflow-y-auto space-y-4 mt-4">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No comments yet</p>
                <p className="text-gray-400 text-sm">
                  Be the first to comment!
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.image || undefined} />
                    <AvatarFallback>
                      {comment.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">
                        {comment.user.name}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {comment.content}
                    </p>
                    {session?.user?.id === comment.userId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={isDeleting === comment.id}
                        className="h-6 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        {isDeleting === comment.id ? (
                          "Deleting..."
                        ) : (
                          <>
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Comment Input */}
          {session ? (
            <div className="border-t pt-4 mt-4 -mx-6 px-6">
              <div className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user?.image || undefined} />
                  <AvatarFallback>
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[80px] resize-none"
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSubmitComment}
                      disabled={isSubmitting || !newComment.trim()}
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        "Posting..."
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Post</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-t pt-4 mt-4 -mx-6 px-6 text-center">
              <p className="text-gray-500 text-sm">
                Please login to add a comment
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
