import Thread from "../components/thread";
import { LoaderFunctionArgs } from "@remix-run/node";
import { requireUser } from "~/.server/session/session";
import { useState } from "react";
import CreateThreadModal from "~/components/create-thread-modal";
import { ActionFunctionArgs } from "@remix-run/node";
import { createThread } from "~/.server/services/thread";
import {
  handleActionSuccess,
  handleCatchErrorAction,
  useToastedActionData,
} from "~/utils/action-utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUser(request);
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUser(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  console.log("intent", intent);
  if (intent === "createThread") {
    const content = formData.get("content") as string;
    const imagesUrlJsonString = formData.get("images") as string;
    const parentThreadId = formData.get("parentThreadId") as string | undefined;
    try {
      const thread = await createThread({
        userId,
        content,
        imagesUrlJsonString,
        parentThreadId,
      });
      console.log(thread);
      return handleActionSuccess("Thread created successfully", thread);
    } catch (error) {
      console.error(error);
      return handleCatchErrorAction(error);
    }
  }
  return null;
};

const ForYou = () => {
  useToastedActionData();
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
