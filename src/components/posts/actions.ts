"use server"

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { PostDataInclude } from "@/lib/types";

export async function deletePost(id: string) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  const deletedPost = await prisma.post.delete({
    where: {
      id,
    },
    include: PostDataInclude,
  });

  return deletedPost;
}