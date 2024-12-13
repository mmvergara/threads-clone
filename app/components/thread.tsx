import {
  HeartIcon,
  MessageCircleIcon,
  Repeat2Icon,
  SendIcon,
} from "lucide-react";
import type { Thread, User } from "~/.server/db/schema";
import { cn, since } from "~/utils/formatters";
import CreateThreadModal from "./create-thread-modal";
import { useEffect, useState } from "react";
import { Form, useNavigate } from "@remix-run/react";
import { Intent, useUniversalActionData } from "~/utils/client-action-utils";
import SubmitBtn from "./submit-btn";
import { toastActionData } from "~/utils/toast";

type Props = {
  thread: Thread;
  user: User;
  isLiked: boolean;
  isReposted: boolean;
  withoutActions?: boolean;
  repostedByUser?: User;
};

const Thread = ({
  thread,
  user,
  isLiked,
  isReposted,
  withoutActions,
  repostedByUser,
}: Props) => {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isRepostDropdownOpen, setIsRepostDropdownOpen] = useState(false);
  const [isOptionsDropdownOpen, setIsOptionsDropdownOpen] = useState(false);
  const data = useUniversalActionData();
  const navigate = useNavigate();
  const handleThreadClick = () => {
    navigate(`/profile/${user.id}`);
  };

  const images = JSON.parse(thread.imageUrls as string) as string[];

  useEffect(() => {
    if (isRepostDropdownOpen) {
      toastActionData(data, Intent.RepostThread, Intent.UnrepostThread);
    }
    if (!data) return;
    setIsRepostDropdownOpen(false);
  }, [data]);

  return (
    <>
      <CreateThreadModal
        isOpen={isReplyModalOpen}
        setIsOpen={setIsReplyModalOpen}
        currentUser={user}
        parentThread={{
          thread,
          user,
        }}
      />

      <article
        onClick={handleThreadClick}
        className="flex gap-2 px-6 py-4 border-[#3d3d3d] border-t-[1px] cursor-pointer"
        role="article"
        aria-label={`Thread by ${user.displayName}`}
      >
        <header className="flex-shrink-0">
          <img
            src={user.profileImageUrl}
            alt={`${user.displayName}'s profile picture`}
            className="w-10 h-10 rounded-full"
          />
        </header>

        <div className="flex-1 w-[calc(100%-50px)">
          <section className="ml-2">
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">
                  {user.displayName}
                </span>
                <time className="text-zinc-500">{since(thread.createdAt)}</time>
              </div>
            </div>
            <div className="mt-1 text-white break-words w-full" role="text">
              {thread.content}
            </div>

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

          {!withoutActions && (
            <footer className="flex text-zinc-500">
              <Form method="post">
                <input
                  type="hidden"
                  name="intent"
                  value={isLiked ? Intent.UnlikeThread : Intent.LikeThread}
                />
                <input type="hidden" name="threadId" value={thread.id} />

                <button
                  onClick={(e) => e.stopPropagation()}
                  className={`flex items-center gap-1 p-2 rounded-full hover:bg-zinc-800 hover:scale-105 transition-colors
                ${isLiked ? "text-red-500" : "hover:text-white"}`}
                  aria-label={isLiked ? "Unlike thread" : "Like thread"}
                  aria-pressed={isLiked}
                >
                  <HeartIcon
                    className="w-5 h-5"
                    fill={isLiked ? "red" : "none"}
                  />
                  {thread.likes > 0 && (
                    <span aria-label={`${thread.likes} likes`}>
                      {thread.likes}
                    </span>
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
                <MessageCircleIcon className="w-5 h-5" />
                {thread.replies > 0 && (
                  <span aria-label={`${thread.replies} replies`}>
                    {thread.replies}
                  </span>
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
                >
                  <Repeat2Icon
                    className={cn("w-5 h-5", isReposted && "text-red-500")}
                  />
                  {thread.reposts > 0 && (
                    <span aria-label={`${thread.reposts} reposts`}>
                      {thread.reposts}
                    </span>
                  )}
                </button>

                {isRepostDropdownOpen && (
                  <div className="absolute bottom-full left-0 z-10 w-48 bg-[#171717] rounded-xl border-[1px] text-white border-[#303030] shadow-lg">
                    <div className="p-2">
                      <Form method="post">
                        <input
                          type="hidden"
                          name="threadId"
                          value={thread.id}
                        />
                        <SubmitBtn
                          intent={
                            isReposted
                              ? Intent.UnrepostThread
                              : Intent.RepostThread
                          }
                          className="w-full flex gap-2 items-center p-4 hover:bg-[#252525] rounded-lg"
                        >
                          <Repeat2Icon
                            className={cn(
                              "w-5 h-5",
                              isReposted && "text-red-500"
                            )}
                          />
                          {isReposted ? "Remove" : "Repost"}
                        </SubmitBtn>
                      </Form>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 p-2 rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
                aria-label="Share thread"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </footer>
          )}
        </div>
      </article>
    </>
  );
};

export default Thread;
