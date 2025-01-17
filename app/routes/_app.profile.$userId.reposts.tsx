import { LoaderFunctionArgs } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { getUserById, isFollowedByUser } from "~/.server/services/user";
import { getUserReposts } from "~/.server/services/threads";
import ProfileHeader from "~/components/profile-header";
import { requireUser } from "~/.server/services/session";
import Thread from "~/components/thread/thread";

// TODO: Implement Granular Error Handling
export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const currentUser = await requireUser(request);
  const userId = params.userId!;
  const user = await getUserById(userId);
  const isFollowed = await isFollowedByUser(currentUser.id, userId);
  const repostThreads = await getUserReposts({ userId });
  return {
    repostThreads,
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

const ProfileRepliesPage = () => {
  const { repostThreads, user, isFollowed, isCurrentUser, currentUser } =
    useLoaderData<Awaited<ReturnType<typeof loader>>>();

  return (
    <>
      <ProfileHeader
        isFollowed={isFollowed}
        user={user}
        isCurrentUser={isCurrentUser}
      />
      {repostThreads.length === 0 ? (
        <div className="text-center text-zinc-500 py-8">No reposts yet</div>
      ) : (
        <div className="flex flex-col">
          {repostThreads.map(({ thread }) => (
            <Thread
              key={thread.id}
              thread={thread}
              threadAuthor={user}
              currentUser={currentUser}
              isLiked={false}
              isReposted={false}
              repostedByUser={user}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ProfileRepliesPage;
