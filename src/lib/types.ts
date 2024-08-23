import { Prisma } from "@prisma/client";

export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    avatarUrl: true,
    displayName: true,
    followers: {
      where: { followerId: loggedInUserId },
      select: { followerId: true },
    },
    _count: { select: { followers: true } },
  } satisfies Prisma.UserSelect;
}

export default function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.PostInclude;
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}

export interface FollowerInfo {
  followers: number
  isFollowedByUser: boolean
}