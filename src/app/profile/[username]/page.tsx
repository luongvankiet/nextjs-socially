import { getPostsByUserId, getPostsLikedByUserId, getProfileByUsername, isFollowing } from '@/actions/profile.action';
import ClientPage from '@/app/profile/[username]/client-page';
import { notFound } from 'next/navigation';

type Params = Promise<{ username: string }>;
export async function generateMetadata({ params }: { params: Params }) {

  const { username } = await params;

  const user = await getProfileByUsername(username);

  if (!user) return;

  return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `Check out ${user.username ?? user.name}'s profile`,
  };
}

async function Profile({ params }: { params: Params }) {
  const { username } = await params;
  const user = await getProfileByUsername(username);
  if (!user) return notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getPostsByUserId(user.id),
    getPostsLikedByUserId(user.id),
    isFollowing(user.id),
  ]);

  return <ClientPage user={user} posts={posts} likedPosts={likedPosts} isFollowing={isCurrentUserFollowing} />;
}

export default Profile;
