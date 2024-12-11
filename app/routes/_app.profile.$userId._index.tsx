import { useState } from "react";
import CreateThreadModal from "~/components/create-thread-modal";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { getUserThreads } from "~/.server/services/threads";
import { requireUser } from "~/.server/session/session";
import { useLoaderData } from "@remix-run/react";
import Thread from "~/components/thread";
import { getUserById } from "~/.server/services/user";
import { universalActionHandler } from "~/.server/action-handler";

export const action = async ({ request }: ActionFunctionArgs) => {
  return universalActionHandler(request);
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const currentUser = await requireUser(request);
  const userId = params.userId!;
  const user = await getUserById(userId);
  const threads = await getUserThreads({
    userId,
    currentUserId: currentUser.id,
  });
  return {
    threads,
    user,
  };
};

const ProfilePage = () => {
  const [isThreadModalOpen, setIsThreadModalOpen] = useState(false);
  const { threads, user } = useLoaderData<Awaited<ReturnType<typeof loader>>>();
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 px-6 py-4">
          <img
            src="https://via.placeholder.com/40x40"
            alt="User avatar"
            className="w-10 h-10 rounded-full"
          />
          <button
            onClick={() => setIsThreadModalOpen(true)}
            className="flex-1 text-left text-zinc-500 text-lg"
          >
            What's new?
          </button>
          <button
            onClick={() => setIsThreadModalOpen(true)}
            className={`px-4 py-2 rounded-full bg-zinc-800 text-zinc-500`}
          >
            Post
          </button>
        </div>
      </div>
      <CreateThreadModal
        isOpen={isThreadModalOpen}
        setIsOpen={setIsThreadModalOpen}
      />
      {threads.length === 0 ? (
        <div className="text-center text-zinc-500 py-8">No threads yet</div>
      ) : (
        <div className="flex flex-col gap-4">
          {threads.map((thread) => (
            <Thread
              key={thread.thread.id}
              user={user}
              thread={thread.thread}
              isLiked={thread.isLiked}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ProfilePage;
