import { useFetcher, useNavigate } from "@remix-run/react";
import { MoreHorizontalIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Thread, User } from "~/.server/db/schema";
import { useClickOutside } from "~/hooks/useClickOutside";
import { elapsedTime } from "~/utils/formatters";

type Props = {
  thread: Thread;
  threadAuthor: User;
};

const ThreadContent = ({ thread, threadAuthor }: Props) => {
  const [isDeleteDropdownOpen, setIsDeleteDropdownOpen] = useState(false);
  const deleteDropdownRef = useClickOutside(() =>
    setIsDeleteDropdownOpen(false)
  );
  const images = JSON.parse(thread.imageUrls as string) as string[];
  const navigate = useNavigate();

  const deleteThreadFetcher = useFetcher();
  return (
    <section className="ml-2" aria-label="Thread content">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div
          className="flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/profile/${threadAuthor.id}`);
          }}
          role="button"
          tabIndex={0}
          aria-label={`View ${threadAuthor.displayName}'s profile`}
        >
          <span className="font-semibold text-white">
            {threadAuthor.displayName}
          </span>
          <time
            dateTime={thread.createdAt.toString()}
            className="text-zinc-500"
          >
            {elapsedTime(thread.createdAt)}
          </time>
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
                <deleteThreadFetcher.Form
                  method="post"
                  action="/api/thread/delete"
                >
                  <input
                    type="hidden"
                    name="threadId"
                    value={thread.id}
                    aria-hidden="true"
                  />
                  <input
                    type="hidden"
                    name="parentThreadId"
                    value={thread.parentThreadId || ""}
                    aria-hidden="true"
                  />
                  <button
                    type="submit"
                    className="w-full flex gap-2 items-center p-4 hover:bg-[#252525] rounded-lg text-red-500"
                  >
                    <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    Delete
                  </button>
                </deleteThreadFetcher.Form>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="mt-1 text-white break-words w-full">{thread.content}</p>

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

export default ThreadContent;
