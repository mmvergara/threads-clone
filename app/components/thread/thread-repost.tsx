import { Repeat2Icon } from "lucide-react";
import { useState } from "react";
import { Thread } from "~/.server/db/schema";
import { Form, useFetcher } from "@remix-run/react";
import { useClickOutside } from "~/hooks/useClickOutside";
import { cn } from "~/utils/formatters";

type Props = {
  thread: Thread;
  isReposted: boolean;
};
const ThreadRepost = ({ thread, isReposted }: Props) => {
  const [isRepostDropdownOpen, setIsRepostDropdownOpen] = useState(false);
  const repostDropdownRef = useClickOutside(() =>
    setIsRepostDropdownOpen(false)
  );

  const repostThreadFetcher = useFetcher();
  return (
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
        {thread.reposts > 0 && <span>{thread.reposts}</span>}
      </button>

      {isRepostDropdownOpen && (
        <div
          ref={repostDropdownRef}
          className="absolute bottom-full left-0 z-10 w-48 bg-[#171717] rounded-xl border-[1px] text-white border-[#303030] shadow-lg"
          role="menu"
        >
          <div className="p-2">
            <repostThreadFetcher.Form method="post" action="/api/thread/repost">
              <input
                type="hidden"
                name="threadId"
                value={thread.id}
                aria-hidden="true"
              />
              <button
                onClick={(e) => e.stopPropagation()}
                type="submit"
                className="w-full flex gap-2 items-center p-4 hover:bg-[#252525] rounded-lg"
              >
                <Repeat2Icon
                  className={cn("w-5 h-5", isReposted && "text-red-500")}
                  aria-hidden="true"
                />
                {isReposted ? "Remove" : "Repost"}
              </button>
            </repostThreadFetcher.Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreadRepost;
