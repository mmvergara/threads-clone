import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { requireUser } from "~/session/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUser(request);
  return null;
};

const MainLayout = () => {
  return (
    <>
      layout
      <Outlet />
    </>
  );
};

export default MainLayout;
