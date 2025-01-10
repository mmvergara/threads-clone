import { SendIcon } from "lucide-react";
import { toast } from "react-toastify";
import { Thread, User } from "~/.server/db/schema";
import ThreadLikeBtn from "./thread-like";
import ThreadReply from "./thread-reply";
import ThreadRepost from "./thread-repost";

type Props = {
  thread: Thread;
  threadAuthor: User;
  isLiked: boolean;
  isReposted: boolean;
  currentUser: User;
};

const ThreadActions = ({
  thread,
  isLiked,
  isReposted,
  currentUser,
  threadAuthor,
}: Props) => {
  return (
    <footer className="flex text-zinc-500" aria-label="Thread actions">
      <ThreadLikeBtn
        threadId={thread.id}
        likes={thread.likes}
        isLiked={isLiked}
      />
      <ThreadReply
        thread={thread}
        threadAuthor={threadAuthor}
        currentUser={currentUser}
      />
      <ThreadRepost thread={thread} isReposted={isReposted} />

      <button
        onClick={(e) => {
          e.stopPropagation();
          const url = `${window.location.host}/threads/${thread.id}`;
          navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard");
        }}
        className="flex items-center gap-1 p-2 rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
        aria-label="Share thread"
      >
        <SendIcon className="w-5 h-5" aria-hidden="true" />
      </button>
    </footer>
  );
};

export default ThreadActions;
