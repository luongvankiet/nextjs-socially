'use client';

import { createComment, deletePost, getPosts, toggleLike } from '@/actions/post.action';
import DeleteAlertDialog from '@/components/delete-alert-dialog';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { SignInButton, useUser } from '@clerk/nextjs';
import { formatDistanceToNow } from 'date-fns';
import { Heart, LogInIcon, MessageCircle, SendIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

function PostCard({ post, dbUserId }: { post: Post; dbUserId: string | null }) {
  const { user } = useUser();
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(post.likes.some((like) => like.userId === dbUserId));
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev);
      setOptimisticLikes((prev) => prev + (hasLiked ? -1 : 1));
      await toggleLike(post.id);
    } catch (error) {
      console.log(error);
      setOptimisticLikes(post._count.likes);
      setHasLiked(false);
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || isCommenting) return;

    try {
      setIsCommenting(true);

      const result = await createComment(post.id, newComment);

      if (result?.success) {
        toast.success('Comment added successfully');
        setNewComment('');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to add comment');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeletePost = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);

      const result = await deletePost(post.id);

      if (result?.success) {
        toast.success('Post deleted successfully');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="px-6 pt-4 pb-0">
          <div className="w-full space-y-4">
            <div className="flex space-x-4 md:space-x-3">
              <Link href={`/profile/${post.author.username}`}>
                <Avatar>
                  <AvatarImage src={post.author.image || '/avatar.png'} />
                </Avatar>
              </Link>

              {/* POST HEADER & TEXT CONTENT */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col truncate sm:flex-row sm:items-center sm:space-x-2">
                    <Link href={`/profile/${post.author.username}`} className="truncate font-semibold">
                      {post.author.name}
                    </Link>

                    <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                      <Link href={`/profile/${post.author.username}`}>@{post.author.username}</Link>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(post.createdAt))}</span>
                    </div>
                  </div>

                  {dbUserId === post.authorId && (
                    <div className="flex items-center space-x-2">
                      <DeleteAlertDialog onDelete={handleDeletePost} isDeleting={isDeleting} />
                    </div>
                  )}
                </div>

                <p className="text-foreground mt-2 text-sm break-words">{post.content}</p>
              </div>
            </div>

            {/* POST IMAGE */}
            {post.image && (
              <div className="overflow-hidden rounded-lg">
                <img src={post.image} alt="Post content" className="h-auto w-full object-cover" />
              </div>
            )}

            {/* POST INTERACTIONS */}
            <div className="flex items-center space-x-4 py-2">
              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-muted-foreground cursor-pointer gap-2 ${hasLiked ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'}`}
                  onClick={handleLike}
                >
                  {hasLiked ? <Heart className="size-5 fill-current" /> : <Heart className="size-5" />} <span>{optimisticLikes}</span>
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
                    <Heart className="size-5" />
                    <span>{optimisticLikes}</span>
                  </Button>
                </SignInButton>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground cursor-pointer gap-2 hover:text-blue-500"
                onClick={() => setShowComments((prev) => !prev)}
              >
                <MessageCircle className={`size-5 ${showComments ? 'fill-blue-500 text-blue-500' : ''}`} />
                <span>{post.comments.length}</span>
              </Button>
            </div>

            {/* POST COMMENTS */}
            {showComments && (
              <div className="space-y-6 border-t border-gray-700 pt-4">
                <div className="space-y-6">
                  {/* DISPLAY COMMENTS */}
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-4">
                      <Avatar className="mr-2 size-8 flex-shrink-0">
                        <AvatarImage src={comment.author.image ?? '/avatar.png'} />
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-white">{comment.author.name}</span>
                            <span className="text-xs text-gray-400">@{comment.author.username}</span>
                            <span className="text-xs text-gray-500">·</span>
                            <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-300">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {user ? (
                  <div className="flex items-start space-x-3">
                    <Avatar className="size-8 flex-shrink-0">
                      <AvatarImage src={user?.imageUrl || '/avatar.png'} />
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[80px] resize-none"
                      />
                      <div className="mt-2 flex justify-end">
                        <Button
                          size="sm"
                          onClick={handleAddComment}
                          className="flex items-center gap-2"
                          disabled={!newComment.trim() || isCommenting}
                        >
                          {isCommenting ? (
                            'Posting...'
                          ) : (
                            <>
                              <SendIcon className="size-4" />
                              Comment
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/50 flex justify-center rounded-lg border p-4">
                    <SignInButton mode="modal">
                      <Button variant="outline" className="gap-2">
                        <LogInIcon className="size-4" />
                        Sign in to comment
                      </Button>
                    </SignInButton>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default PostCard;
