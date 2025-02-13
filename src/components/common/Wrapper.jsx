import React from "react";
import { Outlet } from "react-router-dom";

const Wrapper = () => {
  return (
    <div className="max-w-7xl text-black dark:text-gray-50 mx-auto px-4">
      <Outlet />
    </div>
  );
};

export default Wrapper;
