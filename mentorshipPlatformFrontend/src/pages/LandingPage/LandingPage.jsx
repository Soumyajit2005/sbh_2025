import NavBarMain from "../../components/NavBarMain/NavBarMain";
import { Typography } from "@mui/material"; // Material UI
import { motion } from "framer-motion"; // Framer Motion for animations
import { useNavigate } from "react-router-dom";

import {
  ecosystemImage,
  personalizationImage,
  interviewSimulatorImage,
  networkingAsistantImage,
  learningpathImage,
  progressDashboardImage,
} from "@Assets";

const features = [
  {
    title: "AI powered Resume Builder & Evaluator",
    description:
      "Builds and evaluates resumes using AI based on the job role you're applying for.",
    image: personalizationImage, 
  },
  {
    title: "Personalized Career Plans",
    description:
      "Recommended only after analyzing your skills.",
    image: ecosystemImage, 
  },
  {
    title: "Performance Analytics",
    description: "No more last minute stress before interviews.",
    image: interviewSimulatorImage, 
  },
  {
    title: "Smart Networking Hub",
    description: "Getting referals made easy.",
    image: networkingAsistantImage, 
  },
  {
    title: "Job Internship Opportunities",
    description: "Never miss an hiring update.",
    image: learningpathImage, 
  },
  {
    title: "Industry Insights & Trends",
    description: "Stay Updated with what new is happening in the industry.",
    image: progressDashboardImage, 
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Navbar */}
      <NavBarMain />

      {/* Hero Section */}
      <div
        className="relative flex flex-col items-center justify-center min-h-screen bg-[url('https://images.pexels.com/photos/8037008/pexels-photo-8037008.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center text-white px-8"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", backgroundBlendMode: "overlay" }}
      >
        <div className="text-center max-w-5xl font-Manrope">
          <h1 className="text-6xl font-extrabold sm:text-8xl">
            Your AI Mentor for Smarter Career Growth
          </h1>
          <p className="my-6 text-xl font-medium">
            From building your resume to nailing interviews and growing your
            network, our intelligent platform guides you at every step with
            personalized insights and real-time support.
          </p>
          <div className="flex justify-center space-x-6 mt-8">
            <button className="rounded-xl bg-[#FF00E5] px-20 py-4 text-white font-medium hover:bg-pink-600 transition duration-300" onClick={() => navigate("/auth/register")}>
              Get Started
            </button>
            <button className="rounded-xl bg-white px-20 py-4 text-black font-medium hover:bg-gray-200 transition duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-black bg-opacity-90 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Our Features</h2>
          <div className="space-y-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className={`flex flex-col md:flex-row ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                } items-center md:items-center space-y-6 md:space-y-0`}
              >
                {/* Image */}
                <div className="flex-shrink-0 w-full md:w-1/3 md:px-12">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="rounded-lg shadow-lg w-full h-auto object-cover"
                  />
                </div>

                {/* Text */}
                <div className="w-full md:w-2/3 text-center md:text-left flex flex-col justify-center md:px-12">
                  <Typography variant="h5" className="font-bold text-2xl mb-4">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" className="text-lg">
                    {feature.description}
                  </Typography>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black bg-opacity-90 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Mentorship Platform. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="text-white hover:text-gray-400">
              Privacy Policy
            </a>
            <a href="#" className="text-white hover:text-gray-400">
              Terms of Service
            </a>
            <a href="#" className="text-white hover:text-gray-400">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;