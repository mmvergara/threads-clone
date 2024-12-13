import Thread from "../components/thread";
import { LoaderFunctionArgs } from "@remix-run/node";
import { requireUser } from "~/.server/session/session";
import { useState } from "react";
import CreateThreadModal from "~/components/create-thread-modal";
import { ActionFunctionArgs } from "@remix-run/node";
import { getFollowedUsersThreads } from "~/.server/services/threads";
import { useLoaderData } from "@remix-run/react";
import { universalActionHandler } from "~/.server/action-handler";
import { getFollowedUsers } from "~/.server/services/user";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  try {
    const followedUserIds = await getFollowedUsers(user.id);
    const threads = await getFollowedUsersThreads({
      currentUserId: user.id,
      followedUserIds,
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
    <main className="flex flex-col w-full" role="main">
      <header className="flex items-center gap-3 px-6 py-4" role="banner">
        <img
          src={user?.profileImageUrl}
          alt={`${user?.displayName}'s profile picture`}
          className="w-10 h-10 rounded-full"
        />
        <button
          onClick={() => setIsCreateThreadModalOpen(true)}
          className="flex-1 ml-2 text-left text-zinc-500 text-sm cursor-text"
          aria-label="Create new thread"
          role="button"
        >
          What's new?
        </button>
        <button
          onClick={() => setIsCreateThreadModalOpen(true)}
          className="px-4 py-2 rounded-xl text-white border-[1px] border-zinc-700"
          aria-label="Create post"
          role="button"
        >
          Post
        </button>
      </header>
      {user && (
        <CreateThreadModal
          isOpen={isCreateThreadModalOpen}
          setIsOpen={setIsCreateThreadModalOpen}
          currentUser={user}
        />
      )}
      <section className="threads-list" aria-label="Threads feed">
        {threads.map((thread) => (
          <article key={thread.thread.id}>
            <Thread
              thread={thread.thread}
              user={thread.user}
              isLiked={thread.isLiked}
              isReposted={thread.isReposted}
            />
          </article>
        ))}
      </section>
    </main>
  );
};

export default ForYou;
