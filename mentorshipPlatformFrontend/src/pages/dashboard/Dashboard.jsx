import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./submodules/Sidebar";
import ProfileBar from "./submodules/ProfileBar";
import Banner from "./submodules/Banner";
import { Outlet } from "react-router-dom";
import { ScrollShadow } from "@heroui/react";

const Dashboard = () => {
  const location = useLocation();
  const { email, password } = location.state || {}; // Retrieve email and password
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Profile Bar */}
        <div className="sticky top-0 z-10">
          <ProfileBar />
        </div>

        {/* Scrollable Content */}
        <ScrollShadow hideScrollBar className="w-full h-full">
          {/* Banner */}
          <div className="p-4">
            <Banner email={email} password={password} />

            {/* Main Content Area */}
            <div className="bg-gray-800 p-6 rounded-md">
              <Outlet />
            </div>
          </div>
        </ScrollShadow>
      </div>
    </div>
  );
};

export default Dashboard;
