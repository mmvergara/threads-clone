import { useState } from "react";
import CreateThreadModal from "~/components/create-thread-modal";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { getUserThreads } from "~/.server/services/threads";
import { requireUser } from "~/.server/session/session";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import Thread from "~/components/thread";
import { getUserById, isFollowedByUser } from "~/.server/services/user";
import { universalActionHandler } from "~/.server/action-handler";
import ProfileHeader from "~/components/profile-header";

export const action = async ({ request }: ActionFunctionArgs) => {
  return universalActionHandler(request);
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const currentUser = await requireUser(request);
  const userId = params.userId!;
  const user = await getUserById(userId);
  const isFollowed = await isFollowedByUser(currentUser.id, userId);
  const threads = await getUserThreads({
    userId,
    currentUserId: currentUser.id,
  });
  return {
    threads,
    user,
    isFollowed,
    isCurrentUser: currentUser.id === userId,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Threads by ${data?.user?.handle}` },
    {
      name: "description",
      content: `Threads by ${data?.user?.handle}`,
    },
  ];
};

const ProfilePage = () => {
  const [isCreateThreadModalOpen, setIsCreateThreadModalOpen] = useState(false);
  const { threads, user, isFollowed, isCurrentUser } =
    useLoaderData<Awaited<ReturnType<typeof loader>>>();
  return (
    <>
      <ProfileHeader
        user={user}
        isCurrentUser={isCurrentUser}
        isFollowed={isFollowed}
      />
      {isCurrentUser && (
        <>
          <div className="flex flex-col gap-4 border-b-[1px] border-zinc-700">
            <div className="flex items-center gap-3 px-6 py-4">
              <img
                src={user.profileImageUrl}
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
          </div>
          <CreateThreadModal
            isOpen={isCreateThreadModalOpen}
            setIsOpen={setIsCreateThreadModalOpen}
            currentUser={user}
          />
        </>
      )}
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
