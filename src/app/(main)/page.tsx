import PostEditor from "@/components/posts/editor/PostEditor";
import Image from "next/image";

export default function Home() {
  return (
    <main
      className="w-full"
    >
      <div
        className="w-full"
      >
        <PostEditor />
      </div>
    </main>
  );
}
