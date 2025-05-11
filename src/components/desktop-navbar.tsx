import { getNotificationsCount } from '@/actions/notification.action';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { BellIcon, HomeIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { ModeToggle } from './mode-toggle';

async function DesktopNavbar() {
  const user = await currentUser();
  const notificationCount = await getNotificationsCount();

  return (
    <div className="hidden items-center space-x-4 md:flex">
      <ModeToggle />

      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/">
          <HomeIcon className="h-4 w-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      {user ? (
        <>
          <div className="flex items-center gap-0">
            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link href="/notifications">
                <BellIcon className="h-4 w-4" />
                <span className="hidden lg:inline">Notifications</span>
              </Link>
            </Button>
            {notificationCount > 0 && (
              <Badge variant="destructive" className="size-5 -ml-1">
                {notificationCount}
              </Badge>
            )}
          </div>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href={`/profile/${user.username ?? user.emailAddresses[0].emailAddress.split('@')[0]}`}>
              <UserIcon className="h-4 w-4" />
              <span className="hidden lg:inline">Profile</span>
            </Link>
          </Button>
          <UserButton />
        </>
      ) : (
        <SignInButton mode="modal">
          <Button variant="default">Sign In</Button>
        </SignInButton>
      )}
    </div>
  );
}
export default DesktopNavbar;
