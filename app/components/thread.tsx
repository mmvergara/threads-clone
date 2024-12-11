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
    <div
      onClick={handleThreadClick}
      className="flex gap-4 px-6 py-4 border-[#303030] border-t-[0.5px] cursor-pointer"
    >
      <div className="flex-shrink-0">
        <img
          src={user.profileImageUrl}
          alt="User avatar"
          className="w-10 h-10 rounded-full"
        />
      </div>

      <div className="flex-1 w-[calc(100%-50px)]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-white">{user.displayName}</span>
          <span className="text-zinc-500">{since(thread.createdAt)} ago</span>
        </div>
        <div className="mt-1 text-white break-words w-full">
          {thread.content}
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {JSON.parse(thread.imageUrls as string).map((imageUrl: string) => (
            <div
              key={imageUrl}
              className="relative group border-2 rounded-xl border-zinc-700"
            >
              <img
                src={imageUrl}
                alt="Thread image"
                className="w-[150px] h-[150px] object-cover rounded-md"
              />
            </div>
          ))}
        </div>
        <CreateThreadModal
          isOpen={isReplyModalOpen}
          setIsOpen={setIsReplyModalOpen}
          parentThread={{
            thread,
            user,
          }}
        />
        <div className="flex gap-4 mt-3 text-zinc-500">
          <Form method="post">
            {isLiked ? (
              <input type="hidden" name="intent" value="unlikeThread" />
            ) : (
              <input type="hidden" name="intent" value="likeThread" />
            )}
            <input type="hidden" name="threadId" value={thread.id} />

            {isLiked ? (
              <button
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 p-2 text-red-500 rounded-full hover:bg-zinc-800 hover:scale-105  transition-colors"
              >
                <HeartIcon className="w-5 h-5 " fill="red" />
                {thread.likes > 0 && <span>{thread.likes}</span>}
              </button>
            ) : (
              <button
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 p-2 rounded-full hover:bg-zinc-800 hover:scale-105 hover:text-white transition-colors"
              >
                <HeartIcon className="w-5 h-5" />
              </button>
            )}
          </Form>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsReplyModalOpen(true);
            }}
            className="flex items-center gap-1 p-2 rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <MessageCircleIcon className="w-5 h-5" />
            {thread.replies > 0 && <span>{thread.replies}</span>}
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 p-2 rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <Repeat2Icon className="w-5 h-5" />
            {thread.reposts > 0 && <span>{thread.reposts}</span>}
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 p-2 rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Thread;
