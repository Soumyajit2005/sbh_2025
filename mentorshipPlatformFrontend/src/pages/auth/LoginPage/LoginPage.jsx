import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";

import { loginpagebg } from "@Assets";
import LoginSuccess from "./submodules/LoginSuccess";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      }
  
      // If login is successful
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
  
      setShowSuccess(true);
  
      // Redirect to dashboard and pass email and password
      setTimeout(() => {
        navigate("/dashboard", { state: { email, password } });
      }, 2000);
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // You can navigate to a "Forgot Password" page here if implemented
    // Example: navigate("/forgot-password");
    console.log("Forgot Password functionality is not implemented yet.");
  };

  if (showSuccess) {
    return <LoginSuccess />;
  }

  return (
    <div className="flex w-full h-screen">
      {/* Left Side with Background Image */}
      <div
        className="w-1/3 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginpagebg})` }}
      ></div>

      {/* Right Side with Form */}
      <div className="w-2/3 bg-black text-white flex flex-col items-center justify-center relative">
        {/* Back Icon */}
        <IconButton
          onClick={() => navigate("/")}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            color: "white",
          }}
        >
          <ArrowBack />
        </IconButton>

        {/* Form Content */}
        <div className="w-full flex flex-col items-center">
          <h2 className="text-3xl mb-4 font-bold">Welcome Back</h2>
          <p className="text-gray-400 mb-8">Login to your account</p>
          
          {/* Error Alert */}
          <Collapse in={!!error}>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2, 
                width: '100%', 
                maxWidth: 'sm',
                '& .MuiAlert-message': { color: 'red' } 
              }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          </Collapse>
          
          <form
            className="flex flex-col gap-6 items-center w-full max-w-sm"
            onSubmit={handleSubmit}
          >
            {/* Email Input */}
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                style: { color: "white" },
              }}
              InputLabelProps={{
                style: { color: "gray" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "gray",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
              }}
            />

            {/* Password Input */}
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                style: { color: "white" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      style={{ color: "white" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: { color: "gray" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "gray",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
              }}
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#FF00E5] text-white py-3 rounded-md hover:bg-pink-600 transition duration-300 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </button>
          </form>

          {/* Forgot Password */}
          <button
            type="button"
            className="mt-4 text-blue-500 hover:text-blue-700 transition duration-300"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </button>

          <p className="text-gray-400 mt-4 text-sm">
            By logging in, you agree to our{" "}
            <a href="#" className="underline hover:text-white">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-white">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;