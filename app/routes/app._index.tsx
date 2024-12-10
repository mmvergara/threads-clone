import Thread from "../components/thread";
import { LoaderFunctionArgs } from "@remix-run/node";
import { requireUser } from "~/.server/session/session";
import { useEffect, useState } from "react";
import CreateThreadModal from "~/components/create-thread-modal";
import { ActionFunctionArgs } from "@remix-run/node";
import { createThread, getThreadsWithUser } from "~/.server/services/thread";
import {
  ActionReturnType,
  handleActionSuccess,
  handleCatchErrorAction,
} from "~/.server/utils/action-utils";
import { useActionData, useLoaderData } from "@remix-run/react";
import { toastActionData } from "~/utils/toast";
import { createThreadAction } from "~/.server/intent-actions/create-thread";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUser(request);
  try {
    const threads = await getThreadsWithUser({ limit: 10, skip: 0 });
    console.log(threads);
    return threads;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const user = await requireUser(request);
    const formData = await request.formData();
    const intent = formData.get("intent") as string;

    switch (intent) {
      case "createThread":
        return createThreadAction(user.id, formData);
      default:
        throw new Error("Invalid intent");
    }
  } catch (error) {
    console.error(error);
    return handleCatchErrorAction(error, "createThread");
  }
};

const ForYou = () => {
  const [isOpen, setIsOpen] = useState(false);
  const actionData = useActionData() as ActionReturnType;
  const threads = useLoaderData<typeof loader>();

  useEffect(() => {
    toastActionData(actionData, "createThread");
    if (actionData?.success && actionData?.intent === "createThread") {
      setIsOpen(false);
    }
  }, [actionData]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-3 px-6 py-4">
        <img
          src="https://via.placeholder.com/40x40"
          alt="User avatar"
          className="w-10 h-10 rounded-full"
        />
        <button
          onClick={() => setIsOpen(true)}
          className="flex-1 text-left text-zinc-500 text-lg"
        >
          What's new?
        </button>
        <button
          onClick={() => setIsOpen(true)}
          className={`px-4 py-2 rounded-full bg-zinc-800 text-zinc-500`}
        >
          Post
        </button>
      </div>
      <CreateThreadModal isOpen={isOpen} setIsOpen={setIsOpen} />
      {threads.map((thread) => (
        <Thread
          key={thread.thread.id}
          thread={thread.thread}
          user={thread.user}
        />
      ))}
    </div>
  );
};

export default ForYou;
