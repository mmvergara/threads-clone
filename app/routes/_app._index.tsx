import Thread from "../components/thread";
import { LoaderFunctionArgs } from "@remix-run/node";
import { requireUser } from "~/.server/session/session";
import { useState } from "react";
import CreateThreadModal from "~/components/create-thread-modal";
import { ActionFunctionArgs } from "@remix-run/node";
import { getThreadsWithUser } from "~/.server/services/thread";
import { handleCatchErrorAction } from "~/.server/utils/action-utils";
import { useLoaderData } from "@remix-run/react";
import { createThreadAction } from "~/.server/intent-actions/create-thread";
import { likeThreadAction } from "~/.server/intent-actions/like-thread";
import { unlikeThreadAction } from "~/.server/intent-actions/unlike-thread";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  try {
    const threads = await getThreadsWithUser({
      limit: 10,
      skip: 0,
      userId: user.id,
    });
    return {
      threads,
      user,
    };
  } catch (error) {
    console.error(error);
    return {
      threads: [],
      user: null,
    };
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  let intent: string = "";
  try {
    const user = await requireUser(request);
    const formData = await request.formData();
    intent = formData.get("intent") as string;

    switch (intent) {
      case "createThread":
        return createThreadAction(user.id, formData);
      case "likeThread":
        return likeThreadAction(user.id, formData);
      case "unlikeThread":
        return unlikeThreadAction(user.id, formData);
      default:
        throw new Error("Invalid intent");
    }
  } catch (error) {
    return handleCatchErrorAction(error, intent);
  }
};

const ForYou = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { threads, user } = useLoaderData<Awaited<ReturnType<typeof loader>>>();

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-3 px-6 py-4">
        <img
          src={user?.profileImageUrl}
          alt="User avatar"
          className="w-10 h-10 rounded-full"
        />
        <button
          onClick={() => setIsOpen(true)}
          className="flex-1 text-left text-zinc-500 text-lg"
        >
          What's new?
        </button>
        <button
          onClick={() => setIsOpen(true)}
          className={`px-4 py-2 rounded-full bg-zinc-800 text-zinc-500`}
        >
          Post
        </button>
      </div>
      <CreateThreadModal isOpen={isOpen} setIsOpen={setIsOpen} />
      {threads.map((thread) => (
        <Thread
          key={thread.thread.id}
          thread={thread.thread}
          user={thread.user}
          isLiked={thread.isLiked}
        />
      ))}
    </div>
  );
};

export default ForYou;
