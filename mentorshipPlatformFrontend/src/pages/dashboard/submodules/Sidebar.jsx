import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import SchoolIcon from "@mui/icons-material/School";
import BarChartIcon from "@mui/icons-material/BarChart";
import SupportIcon from "@mui/icons-material/Support";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import InsightsIcon from "@mui/icons-material/Insights";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const Sidebar = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");

  const menuItems = [
    { id: 1, name: "Overview", route: "/dashboard", icon: <HomeIcon /> },
    {
      id: 3,
      name: "Resume Builder & Evaluator",
      route: "/dashboard/resume-builder",
      icon: <SchoolIcon />,
    },
    {
      id: 2,
      name: "Career Plan",
      route: "/dashboard/career-plan",
      icon: <WorkOutlineIcon />,
    },
    {
      id: 4,
      name: "Mock Interview Zone",
      route: "https://ai-interview-agent-flax.vercel.app/",
      icon: <BarChartIcon />,
    },
    {
      id: 6,
      name: "Performance Analytics",
      route: "/dashboard/performance-analytics",
      icon: <BarChartIcon />,
    },
    {
      id: 7,
      name: "Networking Hub",
      route: "/dashboard/networking-hub",
      icon: <PeopleAltIcon />,
    },
    {
      id: 8,
      name: "Job & Internship Opportunities",
      route: "/dashboard/job-opportunities",
      icon: <BusinessCenterIcon />,
    },
    {
      id: 9,
      name: "Industry Insights",
      route: "/dashboard/industry-insights",
      icon: <InsightsIcon />,
    },
    {
      id: 10,
      name: "Profile Settings",
      route: "/dashboard/discussions",
      icon: <SettingsIcon />,
    },
    {
      id: 11,
      name: "Resources",
      route: "/dashboard/discussions",
      icon: <MenuBookIcon />,
    },
  ];

  const handleSelect = (item) => {
    setSelected(item.name);
    if (item.route.startsWith("http")) {
      // Open external URL
      window.open(item.route, "_blank");
    } else {
      // Navigate within the app
      navigate(item.route);
    }
  };

  return (
    <div className="h-screen w-64 bg-black text-white flex flex-col">
      {/* Sidebar Menu with Scrollbar */}
      <div className="flex flex-col mt-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelect(item)}
            className={`flex items-center px-4 py-2 cursor-pointer ${
              selected === item.name
                ? "bg-gray-700 text-white"
                : "hover:bg-gray-800 hover:text-white"
            }`}
          >
            <div className="text-xl">{item.icon}</div>
            <span className="ml-4">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
