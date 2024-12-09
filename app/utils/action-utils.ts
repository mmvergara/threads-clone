import { useEffect } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

export type ActionReturnType<T> = {
  data?: T;
  message?: string[];
  success: boolean;
};

export const useToastedAction = (data?: {
  message?: string[];
  success?: boolean;
}) => {
  useEffect(() => {
    if (data?.message) {
      data.message.forEach((message) => {
        data.success ? toast.success(message) : toast.error(message);
      });
    }
  }, [data]);
};

export const handleErrorAction = (error: unknown) => {
  if (error instanceof z.ZodError) {
    console.error("Validation errors:", error.errors);
    return { success: false, message: error.errors.map((e) => e.message) };
  } else {
    console.error("Unexpected error:", error);
    return { success: false, message: ["Something went wrong 😥"] };
  }
};

export const actionSuccess = (message: string) => {
  return { success: true, message: [message] };
};

export const actionError = (message: string) => {
  return { success: false, message: [message] };
};
