import { LoaderFunctionArgs, redirect, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getThreadWithNestedReplies } from "~/.server/services/threads";
import { requireUser } from "~/.server/services/session";
import { User } from "~/.server/db/schema";
import Thread from "~/components/thread/thread";
import { cn } from "~/utils/formatters";

type NestedThread = {
  id: string;
  createdAt: number;
  userId: string;
  content: string;
  imageUrls: unknown;
  likes: number;
  replies: number;
  reposts: number;
  parentThreadId: string | null;
  user: User | null;
  isLiked: boolean;
  isReposted: boolean;
  childThreads: NestedThread[];
};

// TODO: Implement Granular Error Handling
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const currentUser = await requireUser(request);
  const thread: NestedThread | null = await getThreadWithNestedReplies(
    params.threadId!,
    currentUser.id
  );
  if (!thread) {
    throw redirect("/");
  }
  return {
    thread,
    currentUser,
  };
};

const getTotalChilds = (thread: NestedThread): number => {
  if (!thread.childThreads.length) return 0;
  return thread.childThreads.reduce((acc, reply) => {
    return 1 + getTotalChilds(reply);
  }, 0);
};

const ThreadReplies = ({
  replies,
  currentUser,
  level = 0,
}: {
  replies: NestedThread[];
  currentUser: User;
  level?: number;
}) => {
  return (
    <section className="relative" aria-label="Thread replies">
      {replies.map((reply, index) => {
        const isFirstLevel = level === 0;
        return (
          <article key={reply.id} className={cn("relative pl-8")}>
            {reply.childThreads.length > 0 && (
              <div
                className="absolute left-[74px] top-10 h-[] bottom-0 w-[3px] bg-zinc-800"
                aria-hidden="true"
              />
            )}
            {!isFirstLevel && (
              <div
                className="absolute left-[43px] top-[2.1rem] h-[3px] bottom-0 w-[14px] bg-zinc-800"
                aria-hidden="true"
              />
            )}
            <Thread
              thread={reply}
              threadAuthor={reply.user!}
              currentUser={currentUser}
              isLiked={reply.isLiked}
              isReposted={reply.isReposted}
            />
            {reply.childThreads && reply.childThreads.length > 0 && (
              <ThreadReplies
                replies={reply.childThreads}
                currentUser={currentUser}
                level={level + 1}
              />
            )}
          </article>
        );
      })}
    </section>
  );
};

const ThreadPage = () => {
  const { thread, currentUser } = useLoaderData<typeof loader>();

  if (!thread) {
    return (
      <main className="p-4 text-white" role="main">
        <p>Thread not found</p>
      </main>
    );
  }

  return (
    <main className="flex w-full flex-col" role="main">
      <h1 className="sr-only">Thread Details</h1>
      <article>
        <Thread
          thread={thread}
          threadAuthor={thread.user!}
          currentUser={currentUser}
          isLiked={thread.isLiked}
          isReposted={thread.isReposted}
          isMainThread={true}
        />
        {thread.childThreads && thread.childThreads.length > 0 && (
          <ThreadReplies
            replies={thread.childThreads}
            currentUser={currentUser}
          />
        )}
      </article>
    </main>
  );
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.thread) {
    return [{ title: "Thread" }];
  }

  const threadContent = data.thread.content;
  const authorName = data.thread.user?.displayName || "Unknown User";

  return [
    { title: `${authorName}'s Thread | Your App Name` },
    {
      description:
        threadContent.length > 160
          ? `${threadContent.substring(0, 157)}...`
          : threadContent,
    },
    { "og:title": `${authorName}'s Thread | Your App Name` },
    {
      "og:description":
        threadContent.length > 160
          ? `${threadContent.substring(0, 157)}...`
          : threadContent,
    },
    { "twitter:title": `${authorName}'s Thread | Your App Name` },
    {
      "twitter:description":
        threadContent.length > 160
          ? `${threadContent.substring(0, 157)}...`
          : threadContent,
    },
  ];
};

export default ThreadPage;
