import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { getUserById, isFollowedByUser } from "~/.server/services/user";
import { getUserReplyThreads } from "~/.server/services/threads";
import ProfileHeader from "~/components/profile-header";
import { requireUser } from "~/.server/session/session";
import Thread from "~/components/thread";
import { universalActionHandler } from "~/.server/action-handler";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const currentUser = await requireUser(request);
  const userId = params.userId!;
  const user = await getUserById(userId);
  const isFollowed = await isFollowedByUser(currentUser.id, userId);
  const replyThreads = await getUserReplyThreads({
    userId,
    currentUserId: currentUser.id,
  });
  return {
    replyThreads,
    user,
    isFollowed,
    isCurrentUser: currentUser.id === userId,
    currentUser,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Replies by ${data?.user?.handle}` },
    {
      name: "description",
      content: `Replies by ${data?.user?.handle}`,
    },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) =>
  universalActionHandler(request);

const ProfileRepliesPage = () => {
  const { replyThreads, user, isFollowed, isCurrentUser, currentUser } =
    useLoaderData<Awaited<ReturnType<typeof loader>>>();

  return (
    <main role="main" aria-label={`${user.handle}'s replies`}>
      <header>
        <ProfileHeader
          isFollowed={isFollowed}
          user={user}
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
                  user={user}
                  thread={thread.thread}
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
