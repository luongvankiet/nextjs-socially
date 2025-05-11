import { getPosts } from '@/actions/post.action';
import { getDBUserId } from '@/actions/user.action';
import CreatePost from '@/components/create-post';
import PostCard from '@/components/post-card';
import WhoToFollow from '@/components/who-to-follow';
import { currentUser } from '@clerk/nextjs/server';

export default async function Home() {
  const user = await currentUser();
  const posts = await getPosts();
  const dbUserId = await getDBUserId();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
      <div className="lg:col-span-6">
        {user && <CreatePost />}

        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} dbUserId={dbUserId} />
          ))}
        </div>
      </div>

      <div className="hiddne sticky top-20 lg:col-span-4 lg:block">
        <WhoToFollow />
      </div>
    </div>
  );
}
