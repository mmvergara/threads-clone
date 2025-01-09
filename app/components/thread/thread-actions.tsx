import { Form, useActionData, useFetcher } from "@remix-run/react";
import {
  HeartIcon,
  MessageCircleIcon,
  Repeat2Icon,
  SendIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Thread, User } from "~/.server/db/schema";
import { useClickOutside } from "~/hooks/useClickOutside";
import { Intent, useUniversalActionData } from "~/utils/client-action-utils";
import { cn } from "~/utils/formatters";
import { toastActionData } from "~/utils/toast";
import SubmitBtn from "../submit-btn";
import ThreadLikeBtn from "./thread-like";
import ThreadReply from "./thread-reply";

type Props = {
  thread: Thread;
  threadAuthor: User;
  isLiked: boolean;
  isReposted: boolean;
  currentUser: User;
  repostedByUser?: User;
};

const ThreadActions = ({
  thread,
  isLiked,
  isReposted,
  repostedByUser,
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
