import { PostData, PostsPage } from "@/lib/types";
import { useToast } from "../ui/use-toast";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { deletePost } from "./actions";

export function useDeletePostMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();
  const router = useRouter();

  const pathname = usePathname();
  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      const queryFilter = { queryKey: ["post-feed"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string|null>>(queryFilter, (oldData) => {
        if (!oldData) {
          return;
        }
        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => {
            return {
              posts: page.posts.filter((post: PostData) => post.id !== deletedPost.id),
              nextCursor: page.nextCursor,
            };
          }),
        };
      });

      toast({
        description: "Post deleted successfully.",
      });

      if (pathname === `/posts/${deletedPost.id}`) {
        router.push("/");
    }
  },
    onError() {
      toast({
        variant: "destructive",
        description: "An error occurred while deleting the post.",
      });
    },
  });

  return mutation;
}
