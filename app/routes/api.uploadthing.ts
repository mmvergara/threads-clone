import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
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

const auth = async ({ request }: ActionFunctionArgs) => {
  return await getUserIdFromSession(request);
};

// FileRouter for your app, can contain multiple FileRoutes
const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  threadImageUploader: f({
    image: {
      maxFileSize: "5MB",
      maxFileCount: 5,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ event }) => {
      // This code runs on your server before upload
      const userId = await auth(event);

      // If you throw, the user will not be able to upload
      if (!userId) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {};
    })
    .onUploadComplete(async () => {}),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

import { createRouteHandler } from "uploadthing/remix";

export const { action, loader } = createRouteHandler({
  router: uploadRouter,
  config: {
    logFormat: "pretty",
    logLevel: "Error",
  },
});
