import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { CommentData, CommentsPage} from "@/lib/types";
import { deleteComment, submitComment } from "./actions";

export function useSubmitCommentMutation(postId: string) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment) => {
      const queryKey: QueryKey = ["comments", postId];

      await queryClient.cancelQueries({queryKey});

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          const firsPage = oldData?.pages[0];

          if (firsPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  comments: [...firsPage.comments, newComment],
                  previousCursor: firsPage.previousCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey,
        predicate: (query) => {
          return !query.state.data;
        },
      });
      toast({
        description: "Comment submitted",
      })
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        description: "Failed to submit comment. Please try again.",
      });
    },
  });

  return mutation;
}

export function useDeleteCommentMutation() {
  const {toast}= useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      const queryKey: QueryKey = ["comments", deletedComment.postId];
      await queryClient.cancelQueries({queryKey});
      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              previousCursor: page.previousCursor,
              comments: page.comments.filter(
                (comment) => comment.id !== deletedComment.id,
              ),
            }))
          }
        },
      );
      toast({
        description: "Comment deleted",
      });
      
      
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        description: "Failed to delete comment. Please try again.",
      });
    }
  });
  return mutation;
}