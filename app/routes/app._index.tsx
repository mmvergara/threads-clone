import Thread from "../components/thread";
import { LoaderFunctionArgs } from "@remix-run/node";
import { requireUser } from "~/.server/session/session";
import { useState } from "react";
import CreateThreadModal from "~/components/create-thread-modal";

import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createThread } from "~/.server/services/thread";
import { actionSuccess, handleErrorAction } from "~/utils/action-utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  console.log("intent", intent);
  if (intent === "createThread") {
    const content = formData.get("content") as string;
    const imagesUrlJsonString = formData.get("images") as string;
    const parentThreadId = formData.get("parentThreadId") as string | undefined;
    console.log("content", content);
    console.log("images", imagesUrlJsonString);
    console.log(request.headers.get("Referer"));
    try {
      const threadId = await createThread({
        userId,
        content,
        imagesUrlJsonString,
        parentThreadId,
      });
      return actionSuccess("Thread created successfully" + threadId);
    } catch (error) {
      console.error(error);
      return handleErrorAction(error);
    }
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUser(request);
  return null;
};

const ForYou = () => {
  const [isOpen, setIsOpen] = useState(false);
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
      <Thread />
      <Thread />
      <Thread />
      <Thread />
      <Thread />
      <Thread />
      <Thread />
    </div>
  );
};

export default ForYou;
