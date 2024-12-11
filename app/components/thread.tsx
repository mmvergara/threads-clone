import {
  HeartIcon,
  MessageCircleIcon,
  Repeat2Icon,
  SendIcon,
} from "lucide-react";
import type { Thread, User } from "~/.server/db/schema";
import { since } from "~/utils/formatters";
import CreateThreadModal from "./create-thread-modal";
import { useState } from "react";
import { Form } from "@remix-run/react";
import { Intent } from "~/utils/intents";

type Props = {
  thread: Thread;
  user: User;
  isLiked: boolean;
};

const Thread = ({ thread, user, isLiked }: Props) => {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const handleThreadClick = () => {
    console.log("Thread clicked");
  };

  return (
    <article
      onClick={handleThreadClick}
      className="flex gap-2 px-6 py-4 border-[#303030] border-t-[0.5px] cursor-pointer"
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
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-white">{user.displayName}</span>
            <time className="text-zinc-500">{since(thread.createdAt)} ago</time>
          </div>
          <div className="mt-1 text-white break-words w-full" role="text">
            {thread.content}
          </div>

          <section
            className="flex flex-wrap gap-2 mt-3"
            aria-label="Thread images"
          >
            {JSON.parse(thread.imageUrls as string).map((imageUrl: string) => (
              <div
                key={imageUrl}
                className="relative group border-2 rounded-xl border-zinc-700"
              >
                <img
                  src={imageUrl}
                  alt="Thread attachment"
                  className="w-[150px] h-[150px] object-cover rounded-md"
                />
              </div>
            ))}
          </section>
        </section>

        <CreateThreadModal
          isOpen={isReplyModalOpen}
          setIsOpen={setIsReplyModalOpen}
          parentThread={{
            thread,
            user,
          }}
        />

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
              <HeartIcon className="w-5 h-5" fill={isLiked ? "red" : "none"} />
              {thread.likes > 0 && (
                <span aria-label={`${thread.likes} likes`}>{thread.likes}</span>
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

          <button
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 p-2 rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
            aria-label="Repost thread"
          >
            <Repeat2Icon className="w-5 h-5" />
            {thread.reposts > 0 && (
              <span aria-label={`${thread.reposts} reposts`}>
                {thread.reposts}
              </span>
            )}
          </button>

          <button
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 p-2 rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
            aria-label="Share thread"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </footer>
      </div>
    </article>
  );
};

export default Thread;
