'use server';

import prisma from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) return;

    // check if user exists
    const existinguser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (existinguser) {
      return existinguser;
    }

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ''} ${user.lastName || ''}`,
        username: user.username ?? user.emailAddresses[0].emailAddress.split('@')[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });

    return dbUser;
  } catch (error) {
    console.log('Error in syncUser', error);
  }
}

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: { select: { followers: true, following: true } },
    },
  });
}

export async function getDBUserId() {
  const { userId: clerkId } = await auth();

  if (!clerkId) return null;

  const user = await getUserByClerkId(clerkId);

  if (!user) throw new Error('User not found');

  return user.id;
}

export async function getRandomUsers() {
  try {
    const userId = await getDBUserId();

    if (!userId) return [];

    //get 5 random users exclude ourselves & users that we already followed
    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 5,
    });

    return randomUsers;
  } catch (error) {
    console.error('Failed to get random users', error);
    return [];
  }
}

export async function toggleFollow(targetUserId: string) {
  try {
    const userId = await getDBUserId();

    if (!userId) {
      return;
    }

    if (userId === targetUserId) {
      throw new Error('You cannot follow yourself');
    }

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      //unfollow
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          },
        },
      });
    } else {
      // follow
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: targetUserId,
          },
        }),
        prisma.notification.create({
          data: {
            type: 'FOLLOW',
            userId: targetUserId,
            creatorId: userId,
          },
        }),
      ]);
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.log('Error in toggleFollow', error);
    return { success: false, error: 'Error in toggleFollow' };
  }
}
