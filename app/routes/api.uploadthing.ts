import { createUploadthing, type FileRouter } from "uploadthing/remix";

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
// TODO: Add middleware to check if user is logged in
// TODO: Add middleware to check if user is logged in
// TODO: Add middleware to check if user is logged in
const uploadRouter = {
  threadImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  })
    .middleware(async ({ event }) => {
      const user = getUserIdFromSession(event.request);
      if (!user) {
        return {
          code: "UNAUTHORIZED",
          message: "You need to be logged in to upload images",
        };
      }
      return {};
    })
    .onUploadComplete(async () => {}),

  profileImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async () => {}),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

import { createRouteHandler } from "uploadthing/remix";
import { getUserIdFromSession } from "~/.server/services/session";

export const { action, loader } = createRouteHandler({
  router: uploadRouter,
  config: {
    logFormat: "pretty",
    // logLevel: "Error",
  },
});
