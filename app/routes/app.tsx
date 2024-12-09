import { Outlet } from "@remix-run/react";
import BottomBar from "~/components/layout/bottombar";
import Sidebar from "~/components/layout/sidebar";
import TopBar from "~/components/layout/topbar";

const MainLayout = () => {
  return (
    <div className="flex flex-col sm:flex-row max-h-screen min-h-screen bg-[#0a0a0a] ">
      <Sidebar />
      <TopBar />
      <div className="flex-1 overflow-y-auto mt-14">
        <main className="flex flex-row justify-center gap-4 overflow-hidden  sm:border-[0.5px] border-t-[1px]  border-[#303030] sm:bg-[#181818] max-w-[650px] text-sm mx-auto sm:rounded-3xl">
          <Outlet />
        </main>
      </div>
      <BottomBar />
    </div>
  );
};

export default MainLayout;
