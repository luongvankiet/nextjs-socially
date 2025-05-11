import { getRandomUsers } from '@/actions/user.action';
import FollowButton from '@/components/follow-button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { UserRoundX } from 'lucide-react';
import Link from 'next/link';

async function WhoToFollow() {
  const authUser = await currentUser();
  const users = await getRandomUsers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Who to Follow</CardTitle>
      </CardHeader>
      <CardContent>
        {!authUser ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <UserRoundX className="text-muted size-20" />
            <p className="text-muted-foreground/30">Sign in to see who to follow</p>
            <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
              <SignInButton mode="modal">
                <Button variant="outline" className="lg:flex-1 px-6">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="default" className="lg:flex-1 px-6">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {users.length ? (
              users.map((user) => (
                <div key={user.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <Link href={`/profile/${user.username}`}>
                      <Avatar>
                        <AvatarImage src={user.image ?? '/avatar.png'} />
                      </Avatar>
                    </Link>
                    <div className="text-sm">
                      <Link href={`/profile/${user.username}`} className="cursor-pointer font-medium">
                        {user.name}
                      </Link>
                      <p className="text-muted-foreground">@{user.username}</p>
                      <p className="text-muted-foreground">{user._count.followers} followers</p>
                    </div>
                  </div>

                  <FollowButton userId={user.id} />
                </div>
              ))
            ) : (
              // I need icon over here
              <div className="flex flex-col items-center space-y-2">
                <UserRoundX className="text-muted size-20" />
                <p className="text-muted-foreground/30">No users to follow</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default WhoToFollow;
