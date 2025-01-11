import { createRouteHandler } from "uploadthing/remix";
import { createUploadthing, type FileRouter } from "uploadthing/remix";
import { UploadThingError } from "uploadthing/server";
import { getUserIdFromSession } from "~/.server/services/session";

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

const uploadRouter = {
  threadImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  })
    .middleware(async ({ event }) => {
      const user = getUserIdFromSession(event.request);
      if (!user) throw new UploadThingError("Unauthorized");
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

const routerHandler = createRouteHandler({
  router: uploadRouter,
  config: {
    logFormat: "pretty",
  },
});

export const action = routerHandler.action;
export const loader = routerHandler.loader;
