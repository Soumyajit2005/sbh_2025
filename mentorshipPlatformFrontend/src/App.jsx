import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/auth/LoginPage/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage/RegisterPage";
import Dashboard from "./pages/dashboard/Dashboard";
import Overview from "./pages/dashboard/submodules/overviewpage/Overview";
import CareerPlan from "./pages/careerPlan/CareerPlan";
import Roadmap from "./pages/careerPlan/submodules/Roadmap";
import ResumeBuilder from "./pages/resumeBuilder/ResumeBuilder";
import NetworkingHub from "./pages/networkingHub/NetworkingHub";
import CreateResume from "./pages/resumeBuilder/submodules/CreateResume";
import ResumeEvaluator from "./pages/resumeEvaluator/ResumeEvaluator";
import IndustryInsights from "./pages/industryInsights/IndustryInsights";
import JobAndInternshipOpportunities from "./pages/jobAndInternshipOpportunities/JobAndInternshipOpportunities";
import PerformanceAnalytics from "./pages/performanceAnalytics/PerformanceAnalytics";
import Chatbot from "./components/Chatbot/Chatbot";

function App() {
  return (
    <div>
    <Routes>
      <Route path="/" element={<LandingPage />} />{" "}
      {/* Define the LandingPage route */}
      <Route path="auth">
        {/* <Route path="register" element={<RegisterMain />} /> */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Overview />} /> {/* Default route */}
        <Route path="career-plan" element={<CareerPlan />} />
        <Route path="resume-builder" element={<ResumeBuilder />} />
        <Route path="networking-hub" element={<NetworkingHub />} />
        <Route path="create-resume" element={<CreateResume />} />
        <Route path="resume-evaluator" element={<ResumeEvaluator />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="industry-insights" element={<IndustryInsights />} />
        <Route path="job-opportunities" element={<JobAndInternshipOpportunities />} />
        <Route path="performance-analytics" element={<PerformanceAnalytics />} />
      </Route>
    </Routes>
    <Chatbot /> 
    </div>
  );
}

export default App;
