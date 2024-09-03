import { LikeInfo } from "@/lib/types";

import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { useToast } from "../ui/use-toast";
import { buttonVariants } from "../ui/button";
import { HeartIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  postId: string;
  initialState: LikeInfo;
}

export default function LikeButton({ postId, initialState }: LikeButtonProps) {
  const { toast } = useToast();
  const queryCliente = useQueryClient();

  const queryKey: QueryKey = ["like-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: async () =>
      kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? kyInstance.delete(`/api/posts/${postId}/likes`)
        : kyInstance.post(`/api/posts/${postId}/likes`),
    onMutate: async () => {
      await queryCliente.cancelQueries({ queryKey });

      const previousState = queryCliente.getQueryData<LikeInfo>(queryKey);

      queryCliente.setQueryData<LikeInfo>(queryKey, () => ({
        likes: (previousState?.likes || 0) + (data.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
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
      <HeartIcon 
        className={cn("size-5", data.isLikedByUser && "text-red-500 fill-red-500")}
      />
      <span className="text-sm font-medium tabular-nums">
        {data.likes} <span className="hidden sm:inline">likes</span>
      </span>
    </button>
  )
}
