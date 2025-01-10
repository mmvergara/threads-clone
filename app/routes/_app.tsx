import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { requireUser } from "~/.server/services/session";
import BottomBar from "~/components/layout/bottombar";
import Sidebar from "~/components/layout/sidebar";
import TopBar from "~/components/layout/topbar";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUser(request);
  return null;
};

const MainLayout = () => {
  return (
    <div className="flex flex-col sm:flex-row max-h-screen min-h-screen bg-[#0a0a0a] ">
      <Sidebar />
      <TopBar />
      <div className="flex-1 overflow-y-auto sm:pl-20 scrollbar-custom">
        <div className="sm:mx-2">
          <main className="flex mt-14 gap-4 overflow-hidden sm:border-[1px] border-[#303030] sm:bg-[#181818] max-w-[640px] text-sm mx-auto sm:rounded-3xl min-h-[calc(100vh-100px)]">
            <Outlet />
          </main>
        </div>
      </div>
      <BottomBar />
    </div>
  );
};

export default MainLayout;
