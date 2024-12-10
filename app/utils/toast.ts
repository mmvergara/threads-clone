import { ActionReturnType } from "~/.server/utils/action-utils";
import { toast } from "react-toastify";

export const toastActionData = (
  data: ActionReturnType,
  ...intents: string[]
) => {
  if (intents.includes(data?.intent || "")) {
    data.message?.forEach((message) => {
      data.success ? toast.success(message) : toast.error(message);
    });
  }
};
