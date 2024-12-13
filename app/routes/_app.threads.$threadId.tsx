import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getThreadWithNestedReplies } from "~/.server/services/threads";
import { requireUser } from "~/.server/session/session";
import { User } from "~/.server/db/schema";
import Thread from "~/components/thread";
import { ActionFunctionArgs } from "@remix-run/node";
import { universalActionHandler } from "~/.server/action-handler";
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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const user = await requireUser(request);
  const thread: NestedThread | null = await getThreadWithNestedReplies(
    params.threadId!,
    user.id
  );
  if (!thread) {
    throw redirect("/");
  }
  return {
    thread,
    user,
  };
};

const getTotalChilds = (thread: NestedThread): number => {
  if (!thread.childThreads.length) return 0;
  return thread.childThreads.reduce((acc, reply) => {
    return 1 + getTotalChilds(reply);
  }, 0);
};

export const action = async ({ request }: ActionFunctionArgs) =>
  universalActionHandler(request);

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
    <div className="relative">
      {replies.map((reply, index) => {
        const isFirstLevel = level === 0;
        return (
          <div key={reply.id} className={cn("relative pl-8")}>
            {reply.childThreads.length > 0 && (
              <div
                className={
                  "absolute left-[74px] top-10 h-[] bottom-0 w-[3px] bg-zinc-800"
                }
              />
            )}
            {!isFirstLevel && (
              <div className="absolute left-[43px] top-[2.1rem] h-[3px] bottom-0 w-[14px] bg-zinc-800" />
            )}
            <Thread
              thread={reply}
              user={reply.user!}
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
          </div>
        );
      })}
    </div>
  );
};

const ThreadPage = () => {
  const { thread, user } = useLoaderData<typeof loader>();

  if (!thread) {
    return <div className="p-4 text-white">Thread not found</div>;
  }

  return (
    <div className="flex w-full flex-col">
      <Thread
        thread={thread}
        user={thread.user!}
        isLiked={thread.isLiked}
        isReposted={thread.isReposted}
        isMainThread={true}
      />
      {thread.childThreads && thread.childThreads.length > 0 && (
        <ThreadReplies replies={thread.childThreads} currentUser={user} />
      )}
    </div>
  );
};

export default ThreadPage;
