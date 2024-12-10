import { z } from "zod";

export type ActionReturnType = {
  data?: any;
  message?: string[];
  success: boolean;
  intent: string;
};

export const handleCatchErrorAction = (
  error: unknown,
  intent: string
): ActionReturnType => {
  if (error instanceof z.ZodError) {
    console.error("Validation errors:", error.errors);
    return {
      success: false,
      message: error.errors.map((e) => e.message),
      intent,
    };
  } else {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: ["Something went wrong 😥"],
      intent,
    };
  }
};

export const handleActionSuccess = (
  message: string,
  intent: string,
  data?: unknown
): ActionReturnType => {
  return { success: true, message: [message], data, intent };
};

export const handleActionError = (
  message: string[],
  intent: string
): ActionReturnType => {
  return { success: false, message, intent };
};
