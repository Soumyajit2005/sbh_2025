import React from "react";
import { Typography } from "@mui/material";
import Lottie from "lottie-react";
import { successAnimation } from "@Assets";
const LoginSuccess = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black">
      <Lottie 
        animationData={successAnimation} 
        style={{ height: 150, width: 150 }} 
        loop={false} 
        autoplay={true} 
      />
      <Typography variant="h4" className="text-green-500 mt-4">
        Logged in successfully!
      </Typography>
    </div>
  );
};
export default LoginSuccess;