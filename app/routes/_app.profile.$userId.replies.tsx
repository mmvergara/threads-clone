import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { getUserById, isFollowedByUser } from "~/.server/services/user";
import { getUserReplyThreads } from "~/.server/services/threads";
import ProfileHeader from "~/components/profile-header";
import { requireUser } from "~/.server/services/session";
import Thread from "~/components/thread/thread";

// TODO: Implement Granular Error Handling
export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const currentUser = await requireUser(request);
  const userId = params.userId!;
  const profileUser = await getUserById(userId);
  const isFollowed = await isFollowedByUser(currentUser.id, userId);
  const replyThreads = await getUserReplyThreads({
    userId,
    currentUserId: currentUser.id,
  });
  return {
    replyThreads,
    profileUser,
    isFollowed,
    isCurrentUser: currentUser.id === userId,
    currentUser,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Replies by ${data?.profileUser?.handle}` },
    {
      name: "description",
      content: `Replies by ${data?.profileUser?.handle}`,
    },
  ];
};

const ProfileRepliesPage = () => {
  const { replyThreads, profileUser, isFollowed, isCurrentUser, currentUser } =
    useLoaderData<Awaited<ReturnType<typeof loader>>>();

  return (
    <main role="main" aria-label={`${profileUser.handle}'s replies`}>
      <header>
        <ProfileHeader
          isFollowed={isFollowed}
          user={profileUser}
          isCurrentUser={isCurrentUser}
        />
      </header>
      <section aria-label="Reply threads">
        {replyThreads.length === 0 ? (
          <p className="text-center text-zinc-500 py-8" role="status">
            No replies yet
          </p>
        ) : (
          <div className="flex flex-col" role="feed" aria-label="Reply threads">
            {replyThreads.map((thread) => (
              <article key={thread.thread.id}>
                <Thread
                  threadAuthor={profileUser}
                  thread={thread.thread}
                  currentUser={currentUser}
                  isLiked={thread.isLiked}
                  isReposted={false}
                />
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ProfileRepliesPage;
