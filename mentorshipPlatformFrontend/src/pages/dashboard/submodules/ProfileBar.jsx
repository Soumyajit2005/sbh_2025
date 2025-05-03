import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";

const ProfileBar = () => {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/auth/login");
  };

  const toggleLogout = () => {
    setShowLogout((prev) => !prev);
  };

  return (
    <div className="w-full flex justify-between items-center p-4 bg-black text-white shadow-md relative">
      <h2 className="text-xl font-bold">Career Sensei Dashboard</h2>
      <div className="flex items-center space-x-4 relative">
        {/* Profile Avatar */}
        <Avatar
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="cursor-pointer"
          onClick={toggleLogout}
        />

        {/* Logout Button */}
        {showLogout && (
          <button
            onClick={handleLogout}
            className="absolute top-12 right-0 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300 shadow-lg"
            style={{
              opacity: 0.9,
              backdropFilter: "blur(5px)",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileBar;