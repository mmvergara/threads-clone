import { useEffect } from "react";
import { toast } from "react-toastify";

// Type guard to check if `actionData` is a valid object and not `undefined`
const isRecord = (data: unknown): data is Record<string, any> => {
  return typeof data === "object" && data !== null;
};

export const useToastAction = (
  actionData: Record<string, any> | undefined | unknown
) => {
  useEffect(() => {
    if (actionData && isRecord(actionData)) {
      if ("error" in actionData && typeof actionData.error === "string") {
        toast.error(actionData.error);
      }
      if ("success" in actionData && typeof actionData.success === "string") {
        toast.success(actionData.success);
      }
      if ("info" in actionData && typeof actionData.info === "string") {
        toast.info(actionData.info);
      }
    }
  }, [actionData]);
};
