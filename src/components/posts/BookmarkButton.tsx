import { BookmarkInfo, LikeInfo } from "@/lib/types";

import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { useToast } from "../ui/use-toast";
import { buttonVariants } from "../ui/button";
import { BookmarkIcon, HeartIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

export default function BookmarkButton({ postId, initialState }: BookmarkButtonProps) {
  const { toast } = useToast();
  const queryCliente = useQueryClient();

  const queryKey: QueryKey = ["bookmark-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: async () =>
      kyInstance.get(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/posts/${postId}/bookmark`)
        : kyInstance.post(`/api/posts/${postId}/bookmark`),
    onMutate: async () => {
      toast({
        description: `Post ${data.isBookmarkedByUser ? "un" : ""}bookmarked`,
      })
      await queryCliente.cancelQueries({ queryKey });

      const previousState = queryCliente.getQueryData<BookmarkInfo>(queryKey);

      queryCliente.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));

      return { previousState };
    },
    onError: (error, variables, context) => {
      queryCliente.setQueryData(queryKey, context?.previousState);
      toast({
        variant: "destructive",
        description: "An error occurred",
      });
    },
  });

  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <BookmarkIcon 
        className={cn("size-5", data.isBookmarkedByUser && "text-primary fill-primary")}
      />
    </button>
  )
}
