import {
  HeartIcon,
  MessageCircleIcon,
  Repeat2Icon,
  SendIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from "lucide-react";
import type { Thread, User } from "~/.server/db/schema";
import { cn, since } from "~/utils/formatters";
import CreateThreadModal from "./create-thread-modal";
import { useEffect, useState } from "react";
import { Form,  useNavigate } from "@remix-run/react";
import { Intent, useUniversalActionData } from "~/utils/client-action-utils";
import SubmitBtn from "./submit-btn";
import { toastActionData } from "~/utils/toast";
import { useClickOutside } from "~/hooks/useClickOutside";
import { toast } from "react-toastify";

const ThreadContent = ({ thread, user }: { thread: Thread; user: User }) => {
  const [isDeleteDropdownOpen, setIsDeleteDropdownOpen] = useState(false);
  const deleteDropdownRef = useClickOutside(() =>
    setIsDeleteDropdownOpen(false)
  );
  const images = JSON.parse(thread.imageUrls as string) as string[];
  const navigate = useNavigate();

  return (
    <section className="ml-2" aria-label="Thread content">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div
          className="flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/profile/${user.id}`);
          }}
          role="button"
          tabIndex={0}
          aria-label={`View ${user.displayName}'s profile`}
        >
          <span className="font-semibold text-white">{user.displayName}</span>
          <time dateTime={thread.createdAt.toString()} className="text-zinc-500">{since(thread.createdAt)}</time>
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDropdownOpen((o) => !o);
            }}
            className="p-1 rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
            aria-label="Thread options"
            aria-expanded={isDeleteDropdownOpen}
            aria-haspopup="true"
          >
            <MoreHorizontalIcon className="w-5 h-5" aria-hidden="true" />
          </button>

          {isDeleteDropdownOpen && (
            <div
              ref={deleteDropdownRef}
              className="absolute top-full right-0 z-10 w-48 bg-[#171717] rounded-xl border-[1px] text-white border-[#303030] shadow-lg"
              role="menu"
            >
              <div className="p-2">
                <Form method="post">
                  <input type="hidden" name="threadId" value={thread.id} aria-hidden="true" />
                  <SubmitBtn
                    intent={Intent.DeleteThread}
                    className="w-full flex gap-2 items-center p-4 hover:bg-[#252525] rounded-lg text-red-500"
                    role="menuitem"
                  >
                    <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    Delete
                  </SubmitBtn>
                </Form>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="mt-1 text-white break-words w-full">
        {thread.content}
      </p>

      {images.length > 0 && (
        <section
          className="flex flex-wrap gap-2 mt-2 mb-2"
          aria-label="Thread images"
        >
          {images.map((imageUrl: string) => (
            <div
              key={imageUrl}
              className="relative group border-2 rounded-xl border-zinc-700"
            >
              <img
                src={imageUrl}
                alt="Thread attachment"
                className="w-[150px] h-[150px] object-cover rounded-xl"
              />
            </div>
          ))}
        </section>
      )}
    </section>
  );
};

const ThreadActions = ({
  thread,
  isLiked,
  isReposted,
  setIsReplyModalOpen,
  repostedByUser,
}: {
  thread: Thread;
  isLiked: boolean;
  isReposted: boolean;
  setIsReplyModalOpen: (value: boolean) => void;
  repostedByUser?: User;
}) => {
  const data = useUniversalActionData();
  const [isRepostDropdownOpen, setIsRepostDropdownOpen] = useState(false);
  const repostDropdownRef = useClickOutside(() =>
    setIsRepostDropdownOpen(false)
  );

  useEffect(() => {
    if (isRepostDropdownOpen) {
      toastActionData(data, Intent.RepostThread, Intent.UnrepostThread);
    }
    if (!data) return;
    setIsRepostDropdownOpen(false);
  }, [data]);

  return (
    <footer className="flex text-zinc-500" aria-label="Thread actions">
      <Form method="post">
        <input
          type="hidden"
          name="intent"
          value={isLiked ? Intent.UnlikeThread : Intent.LikeThread}
          aria-hidden="true"
        />
        <input type="hidden" name="threadId" value={thread.id} aria-hidden="true" />
        <button
          onClick={(e) => e.stopPropagation()}
          className={`flex items-center gap-1 p-2 rounded-full hover:bg-zinc-800 hover:scale-105 transition-colors
          ${isLiked ? "text-red-500" : "hover:text-white"}`}
          aria-label={isLiked ? "Unlike thread" : "Like thread"}
          aria-pressed={isLiked}
        >
          <HeartIcon className="w-5 h-5" fill={isLiked ? "red" : "none"} aria-hidden="true" />
          {thread.likes > 0 && (
            <span>{thread.likes}</span>
          )}
        </button>
      </Form>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsReplyModalOpen(true);
        }}
        className="flex items-center gap-1 p-2 rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
        aria-label="Reply to thread"
      >
        <MessageCircleIcon className="w-5 h-5" aria-hidden="true" />
        {thread.replies > 0 && (
          <span>{thread.replies}</span>
        )}
      </button>

      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsRepostDropdownOpen((o) => !o);
          }}
          className="flex items-center gap-1 p-2 rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
          aria-label="Repost options"
          aria-expanded={isRepostDropdownOpen}
          aria-haspopup="true"
        >
          <Repeat2Icon
            className={cn("w-5 h-5", isReposted && "text-red-500")}
            aria-hidden="true"
          />
          {thread.reposts > 0 && (
            <span>{thread.reposts}</span>
          )}
        </button>

        {isRepostDropdownOpen && (
          <div
            ref={repostDropdownRef}
            className="absolute bottom-full left-0 z-10 w-48 bg-[#171717] rounded-xl border-[1px] text-white border-[#303030] shadow-lg"
            role="menu"
          >
            <div className="p-2">
              <Form method="post">
                <input type="hidden" name="threadId" value={thread.id} aria-hidden="true" />
                <SubmitBtn
                  intent={
                    isReposted ? Intent.UnrepostThread : Intent.RepostThread
                  }
                  className="w-full flex gap-2 items-center p-4 hover:bg-[#252525] rounded-lg"
                  role="menuitem"
                >
                  <Repeat2Icon
                    className={cn("w-5 h-5", isReposted && "text-red-500")}
                    aria-hidden="true"
                  />
                  {isReposted ? "Remove" : "Repost"}
                </SubmitBtn>
              </Form>
            </div>
          </div>
        )}
      </div>
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

type Props = {
  thread: Thread;
  user: User;
  isLiked: boolean;
  isReposted: boolean;
  withoutActions?: boolean;
  repostedByUser?: User;
  isMainThread?: boolean;
};

const Thread = ({
  thread,
  user,
  isLiked,
  isReposted,
  withoutActions,
  repostedByUser,
  isMainThread,
}: Props) => {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleThreadClick = () => {
    if (thread.parentThreadId) return;
    navigate(`/threads/${thread.id}`);
  };

  return (
    <>
      <CreateThreadModal
        isOpen={isReplyModalOpen}
        setIsOpen={setIsReplyModalOpen}
        currentUser={user}
        parentThread={{ thread, user }}
      />
      <article
        onClick={handleThreadClick}
        className={cn(
          "flex gap-2 flex-col px-6 py-4 cursor-pointer relative",
          isMainThread && "border-b border-zinc-800"
        )}
        role="article"
        aria-label={`Thread by ${user.displayName}`}
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
              navigate(`/profile/${user.id}`);
            }}
            role="button"
            tabIndex={0}
            aria-label={`View ${user.displayName}'s profile`}
          >
            <img
              src={user.profileImageUrl}
              alt={`${user.displayName}'s profile picture`}
              className="w-10 h-10 rounded-full"
            />
          </header>

          <div className="flex-1 w-[calc(100%-50px)]">
            <ThreadContent thread={thread} user={user} />

            {!withoutActions && (
              <ThreadActions
                thread={thread}
                isLiked={isLiked}
                isReposted={isReposted}
                setIsReplyModalOpen={setIsReplyModalOpen}
              />
            )}
          </div>
        </div>
      </article>
    </>
  );
};

export default Thread;
