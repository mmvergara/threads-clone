import { useActionData } from "@remix-run/react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { z } from "zod";

export type ActionReturnType<T> = {
  data?: T;
  message?: string[];
  success: boolean;
};

export const useToastedActionData = () => {
  const data = useActionData() as {
    success?: boolean;
    message?: string[];
    data?: unknown;
  };

  useEffect(() => {
    if (!data) return;
    if (data.success) {
      data?.message?.forEach((message) => {
        data?.success ? toast.success(message) : toast.error(message);
      });
    }
  }, [data]);

  return data;
};

export const handleErrorAction = (error: unknown): ActionReturnType<never> => {
  if (error instanceof z.ZodError) {
    console.error("Validation errors:", error.errors);
    return {
      success: false,
      message: error.errors.map((e) => e.message),
    };
  } else {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: ["Something went wrong 😥"],
    };
  }
};

export function actionSuccess<T>(message: string): ActionReturnType<T> {
  return { success: true, message: [message] };
}

export const actionError = (message: string): ActionReturnType<never> => {
  return { success: false, message: [message] };
};
