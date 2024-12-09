import { LoaderFunctionArgs } from "@remix-run/node";
import { requireUser } from "~/session/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUser(request);
  return null;
};

const HomePage = () => {
  return <>HOME PAGE</>;
};

export default HomePage;
