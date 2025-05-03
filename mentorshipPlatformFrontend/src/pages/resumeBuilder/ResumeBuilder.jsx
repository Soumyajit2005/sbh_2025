import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResumeForm from "./submodules/ResumeForm";
import ResumeEvaluator from "../resumeEvaluator/ResumeEvaluator";

const ResumeBuilder = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const navigate = useNavigate();

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption === "scratch") {
      setShowResumeForm(true);
    } else if (selectedOption === "upload") {
      // Handle the upload option here
      setShowUpload(true);
    }
  };

  const handleBack = () => {
    setShowResumeForm(false);
    setShowUpload(false);
  };

  const userData = {
    fullName: "Soumyajit Paria",
    email: "soumyajitparia02@gmail.com",
    phone: "+919062435655",
    location: "West Bengal",
    educationLevel: "Bachelor",
    institution: "Meghnad Saha Institute of Technology",
    fieldOfStudy: "Computer Scinece",
    graduationDate: "2027-04",
    careerInterests: "Full Stack Develpoer",
    industries: ["Technology"],
    technicalSkills: [
      "Google Cloud",
      "Kubernetes",
      "Angular",
      "Python",
      "Java",
    ],
    softSkills: [
      "Adaptability",
      "Attention to Detail",
      "Communication",
      "Teamwork",
    ],
    experiences: [
      {
        title: "Full Stack Developer Intern",
        company: "Google",
        duration: "June 2023 - June 2027",
        achievements: "Made a project on Google Cloud and Kubernetes",
      },
    ],
  };

  return (
    <>
      {showResumeForm ? (
        <ResumeForm onBack={handleBack} userData={userData} />
      ) : showUpload ? (
        navigate("/dashboard/resume-evaluator")
      ) : (
        <div className=" bg-gray-900 flex flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-4xl">
            {/* Main heading */}
            <h1 className="text-3xl font-bold text-center mb-2">
              Are you uploading an existing resume?
            </h1>
            <p className="text-center text-gray-300 mb-10">
              Just review, edit, and update it with new information
            </p>

            {/* Options container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Option 1: Upload existing resume */}
              <div
                className={`border rounded-lg p-8 flex flex-col items-center cursor-pointer transition-all hover:border-blue-500 relative
              ${selectedOption === "upload" ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"}`}
                onClick={() => handleOptionSelect("upload")}
              >
                {/* Recommended badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-pink-100 text-pink-800 px-4 py-1 rounded-full text-sm font-medium">
                  Recommended option to save you time
                </div>

                {/* Icon */}
                <div className="w-16 h-16 mb-6 flex items-center justify-center">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="38" height="48" rx="4" fill="#F0F9FF" />
                    <path
                      d="M30 16H10C8.89543 16 8 16.8954 8 18V38C8 39.1046 8.89543 40 10 40H30C31.1046 40 32 39.1046 32 38V18C32 16.8954 31.1046 16 30 16Z"
                      stroke="#0F766E"
                      strokeWidth="2"
                    />
                    <path
                      d="M20 28V16M20 16L16 20M20 16L24 20"
                      stroke="#0F766E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Text */}
                <h2 className="text-xl font-bold mb-2">
                  Yes, upload from my resume
                </h2>
                <p className="text-gray-300 text-center">
                  We'll give you expert guidance to fill out your info and
                  enhance your resume, from start to finish
                </p>
              </div>

              {/* Option 2: Start from scratch */}
              <div
                className={`border rounded-lg p-8 flex flex-col items-center cursor-pointer transition-all hover:border-blue-500
              ${selectedOption === "scratch" ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"}`}
                onClick={() => handleOptionSelect("scratch")}
              >
                {/* Icon */}
                <div className="w-16 h-16 mb-6 flex items-center justify-center">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="38" height="48" rx="4" fill="#F0F9FF" />
                    <path
                      d="M30 16H10C8.89543 16 8 16.8954 8 18V38C8 39.1046 8.89543 40 10 40H30C31.1046 40 32 39.1046 32 38V18C32 16.8954 31.1046 16 30 16Z"
                      stroke="#1E40AF"
                      strokeWidth="2"
                    />
                    <path
                      d="M32 30L24 22M24 22L16 30M24 22V38"
                      stroke="#1E40AF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Text */}
                <h2 className="text-xl font-bold mb-2">
                  No, start from scratch
                </h2>
                <p className="text-gray-300 text-center">
                  We'll guide you through the whole process so your skills can
                  shine
                </p>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-center items-center">
              <div className="flex flex-col items-center justify-center">
                <button
                  className={`px-6 py-3 rounded-full font-medium ${
                    selectedOption
                      ? "bg-blue-700 text-white hover:bg-blue-800"
                      : "bg-gray-500 text-gray-300 cursor-not-allowed"
                  } transition-colors`}
                  disabled={!selectedOption}
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResumeBuilder;
