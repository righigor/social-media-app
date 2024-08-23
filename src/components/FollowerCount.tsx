"use client"
import useFollowerInfo from "@/hooks/useFollwerInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface FollowerCountProps {
  userId: string;
  initialData: FollowerInfo;
}

export default function FollowerCount({
  userId,
  initialData,
}: FollowerCountProps) {
  const { data } = useFollowerInfo(userId, initialData);
  return (
    <span>
      Followers:{" "}
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  );
}
