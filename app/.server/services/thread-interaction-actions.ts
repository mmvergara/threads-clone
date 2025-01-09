import {
  hasUserRepostedThread,
  repostThread,
  unrepostThread,
} from "./thread-interactions";
import { handleActionError, handleActionSuccess } from "../utils/action-utils";
import { Intent } from "~/utils/client-action-utils";

export const repostThreadAction = async (
  currentUserId: string,
  formData: FormData,
  intent: Intent
) => {
  const threadId = formData.get("threadId") as string;

  const hasUserReposted = await hasUserRepostedThread(threadId, currentUserId);
  if (hasUserReposted) {
    return handleActionError(["You already reposted this thread"], intent);
  }

  const thread = await repostThread(threadId, currentUserId);
  return handleActionSuccess("Thread reposted", intent, thread);
};

export const unrepostThreadAction = async (
  currentUserId: string,
  formData: FormData,
  intent: Intent
) => {
  const threadId = formData.get("threadId") as string;
  const thread = await unrepostThread(threadId, currentUserId);
  return handleActionSuccess("Thread unreposted", intent, thread);
};
