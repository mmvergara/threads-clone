import { Outlet } from "@remix-run/react";

export const loader = async () => {
  console.log("loader");
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
