import { createUploadthing, type FileRouter } from "uploadthing/remix";
import { UploadThingError } from "uploadthing/server";
import { getUserIdFromSession } from "~/.server/session/session";

const f = createUploadthing({
  errorFormatter(err) {
    if (err.code === "BAD_REQUEST") {
      return {
        message:
          "You can only upload a maximum of 5 images, each up to 5MB in size",
      };
    }
    return {
      message: "Something went wrong",
    };
  },
});

// TODO: Add middleware to check if user is logged in
const uploadRouter = {
  threadImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  }).onUploadComplete(async () => {}),

  profileImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async () => {}),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

import { createRouteHandler } from "uploadthing/remix";

export const { action, loader } = createRouteHandler({
  router: uploadRouter,
  config: {
    logFormat: "pretty",
    // logLevel: "Error",
  },
});
