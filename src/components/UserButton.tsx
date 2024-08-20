"use client"

import { useSession } from "@/app/(main)/SessionProvider";
import { DropdownMenu } from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const { user } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>

      </DropdownMenuTrigger>
    </DropdownMenu>
  );
}