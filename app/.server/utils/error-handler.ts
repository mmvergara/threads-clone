import { z } from "zod";

export const handleServerError = (error: unknown) => {
  console.log("Action Error: ", error);
  console.log(error instanceof Error);
  let errMessage = "An unexpected error occurred";
  if (error instanceof z.ZodError) {
    errMessage = error.errors.map((e) => e.message).join(", ");
  } else if (error instanceof Error) {
    errMessage = error.message;
  }
  return { error: errMessage };
};
