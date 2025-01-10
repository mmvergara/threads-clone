import { Repeat2Icon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
import type { Thread, User } from "~/.server/db/schema";
import { cn, since } from "~/utils/formatters";
import { Form, useNavigate } from "@remix-run/react";
import { useClickOutside } from "~/hooks/useClickOutside";
import ThreadActions from "./thread-actions";
import ThreadContent from "./thread-content";

type Props = {
  thread: Thread;
  threadAuthor: User;
  currentUser: User;
  isLiked: boolean;
  isReposted: boolean;
  withoutActions?: boolean;
  repostedByUser?: User;
  isMainThread?: boolean;
};

const Thread = ({
  thread,
  threadAuthor,
  currentUser,
  isLiked,
  isReposted,
  withoutActions,
  repostedByUser,
  isMainThread,
}: Props) => {
  const navigate = useNavigate();

  const handleThreadClick = () => {
    if (thread.parentThreadId) return;
    navigate(`/threads/${thread.id}`);
  };

  return (
    <article>
      <div
        onClick={handleThreadClick}
        className={cn(
          "flex gap-2 flex-col px-6 py-4 cursor-pointer relative",
          isMainThread && "border-b border-zinc-800"
        )}
        role="article"
        aria-label={`Thread by ${threadAuthor.displayName}`}
        tabIndex={0}
      >
        {repostedByUser && (
          <p className="ml-6 text-zinc-400 flex items-center gap-2">
            <Repeat2Icon className="w-4 h-4" aria-hidden="true" />
            <span>Reposted by {repostedByUser?.displayName}</span>
          </p>
        )}
        <div className="flex gap-2">
          <header
            className="flex-shrink-0 relative"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${threadAuthor.id}`);
            }}
            role="button"
            tabIndex={0}
            aria-label={`View ${threadAuthor.displayName}'s profile`}
          >
            <img
              src={threadAuthor.profileImageUrl}
              alt={`${threadAuthor.displayName}'s profile picture`}
              className="w-10 h-10 rounded-full"
            />
          </header>

          <div className="flex-1 w-[calc(100%-50px)]">
            <ThreadContent thread={thread} threadAuthor={threadAuthor} />
            {!withoutActions && (
              <ThreadActions
                currentUser={currentUser}
                threadAuthor={threadAuthor}
                thread={thread}
                isLiked={isLiked}
                isReposted={isReposted}
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default Thread;
