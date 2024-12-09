import Thread from "../components/thread";
import CreateThreadButton from "../components/create-thread";
import { LoaderFunctionArgs } from "@remix-run/node";
import { requireUser } from "~/session/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUser(request);
  return null;
};
const ForYou = () => {
  return (
    <div className="flex flex-col w-full">
      <CreateThreadButton />
      <Thread />
      <Thread />
      <Thread />
      <Thread />
      <Thread />
      <Thread />
      <Thread />
    </div>
  );
};

export default ForYou;
