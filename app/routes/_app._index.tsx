import Thread from "../components/thread";
import { LoaderFunctionArgs } from "@remix-run/node";
import { requireUser } from "~/.server/session/session";
import { useState } from "react";
import CreateThreadModal from "~/components/create-thread-modal";
import { ActionFunctionArgs } from "@remix-run/node";
import { getThreadsWithUser } from "~/.server/services/threads";
import { useLoaderData } from "@remix-run/react";
import { universalActionHandler } from "~/.server/action-handler";

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

export const meta = () => {
  return [{ title: "Threads Clone" }];
};

export const action = async ({ request }: ActionFunctionArgs) =>
  universalActionHandler(request);

const ForYou = () => {
  const [isCreateThreadModalOpen, setIsCreateThreadModalOpen] = useState(false);
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
          onClick={() => setIsCreateThreadModalOpen(true)}
          className="flex-1 ml-2 text-left text-zinc-500 text-sm cursor-text"
        >
          What's new?
        </button>
        <button
          onClick={() => setIsCreateThreadModalOpen(true)}
          className="px-4 py-2 rounded-xl text-white border-[1px] border-zinc-700"
        >
          Post
        </button>
      </div>
      {user && (
        <CreateThreadModal
          isOpen={isCreateThreadModalOpen}
          setIsOpen={setIsCreateThreadModalOpen}
          currentUser={user}
        />
      )}
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
