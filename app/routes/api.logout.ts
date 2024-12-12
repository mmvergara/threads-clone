import { redirect } from "@remix-run/node";
import { removeUserFromSession } from "~/.server/session/session";

export const loader = async () => {
  const header = await removeUserFromSession();
  return redirect("/", {
    headers: {
      "Set-Cookie": header,
    },
  });
};
