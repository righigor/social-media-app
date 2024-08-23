import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowerInfo(userId: string, initialStae: FollowerInfo) {
  const query = useQuery({
    queryKey: ["follower-info", userId],
    queryFn: async () => kyInstance.get(`/api/users/${userId}/followers`).json<FollowerInfo>(),
    initialData: initialStae,
    staleTime: Infinity,
  });

  return query;
}