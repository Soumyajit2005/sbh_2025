import { useState, useEffect } from "react";

const Banner = ({ email, password }) => {
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/fetch-profile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setFullName(data.fullName); // Assuming the API returns the full name

      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  });
  return (
    <div className="w-full h-48 bg-gray-800 text-white flex items-center justify-center rounded-md my-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome, {fullName}</h1>
        <p className="text-lg mt-2">One Step Closer to Your Dream Career.</p>
      </div>
    </div>
  );
};

export default Banner;
