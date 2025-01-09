import { useFetcher } from "@remix-run/react";
import { HeartIcon } from "lucide-react";

type Props = {
  threadId: string;
  likes: number;
  isLiked: boolean;
};
const ThreadLike = ({ isLiked, likes, threadId }: Props) => {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="post" action="/api/thread/like">
      <button
        name="threadId"
        value={threadId}
        type="submit"
        onClick={(e) => e.stopPropagation()}
        className={`flex items-center gap-1 p-2 rounded-full hover:bg-zinc-800 hover:scale-105 transition-colors
          ${isLiked ? "text-red-500" : "hover:text-white"}`}
        aria-label={isLiked ? "Unlike thread" : "Like thread"}
        aria-pressed={isLiked}
      >
        <HeartIcon
          className="w-5 h-5"
          fill={isLiked ? "red" : "none"}
          aria-hidden="true"
        />
        {likes > 0 && <span>{likes}</span>}
      </button>
    </fetcher.Form>
  );
};

export default ThreadLike;
