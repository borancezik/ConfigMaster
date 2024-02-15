import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const MainLayout = () => {
  return (
    <div className="w-full h-full bg-[#F5F5F5]">
      <Header />
      <Outlet />
    </div>
  );
};

export default MainLayout;
