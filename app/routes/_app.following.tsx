import Thread from "../components/thread/thread";
import { LoaderFunctionArgs } from "@remix-run/node";
import { requireUser } from "~/.server/services/session";
import { useState } from "react";
import CreateThreadModal from "~/components/create-thread-modal";
import { getFollowedUsersThreads } from "~/.server/services/threads";
import { useLoaderData } from "@remix-run/react";
import { getFollowedUsers } from "~/.server/services/user";

// TODO: Implement Granular Error Handling
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await requireUser(request);
  const followedUserIds = await getFollowedUsers(currentUser.id);
  const threads = await getFollowedUsersThreads({
    currentUserId: currentUser.id,
    followedUserIds,
  });
  return {
    threads,
    currentUser,
  };
};

export const meta = () => {
  return [
    { title: "Threads Clone" },
    {
      name: "description",
      content: "Follow and interact with threads from people you follow",
    },
    { property: "og:title", content: "Following - Threads Clone" },
    {
      property: "og:description",
      content: "Stay updated with threads from people you follow",
    },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
    { charSet: "utf-8" },
  ];
};

const ForYou = () => {
  const [isCreateThreadModalOpen, setIsCreateThreadModalOpen] = useState(false);
  const { threads, currentUser } =
    useLoaderData<Awaited<ReturnType<typeof loader>>>();
  return (
    <main className="flex flex-col w-full" role="main">
      <header className="flex items-center gap-3 px-6 py-4" role="banner">
        <img
          src={currentUser.profileImageUrl}
          alt={`${currentUser.displayName}'s profile picture`}
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
      {currentUser && (
        <>
          <CreateThreadModal
            isOpen={isCreateThreadModalOpen}
            setIsOpen={setIsCreateThreadModalOpen}
            currentUser={currentUser}
          />

          <section className="threads-list" aria-label="Threads feed">
            {threads.map((thread) => (
              <article key={thread.thread.id}>
                <Thread
                  thread={thread.thread}
                  threadAuthor={thread.user}
                  currentUser={currentUser}
                  isLiked={thread.isLiked}
                  isReposted={thread.isReposted}
                />
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
};

export default ForYou;
