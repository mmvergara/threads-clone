import { Thread, User } from "~/.server/db/schema";
import CreateThreadModal from "../create-thread-modal";
import { useState } from "react";
import { MessageCircleIcon } from "lucide-react";
type Props = {
  thread: Thread;
  threadAuthor: User;
  currentUser: User;
};
const ThreadReply = ({ thread, threadAuthor, currentUser }: Props) => {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  return (
    <>
      <CreateThreadModal
        isOpen={isReplyModalOpen}
        setIsOpen={setIsReplyModalOpen}
        currentUser={currentUser}
        parentThread={{ thread, threadAuthor }}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsReplyModalOpen(true);
        }}
        className="flex items-center gap-1 p-2 rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
        aria-label="Reply to thread"
      >
        <MessageCircleIcon className="w-5 h-5" aria-hidden="true" />
        {thread.replies > 0 && <span>{thread.replies}</span>}
      </button>
    </>
  );
};

export default ThreadReply;
