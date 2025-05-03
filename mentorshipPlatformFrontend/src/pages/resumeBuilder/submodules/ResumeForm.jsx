import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Plus,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const ResumeForm = ({ onBack, userData = {} }) => {
  // State for form sections expansion
  const [expandedSection, setExpandedSection] = useState("personal");

  // Prefilled data with existing user information
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: userData.fullName || "",
    email: userData.email || "",
    phone: userData.phone || "",
    location: userData.location || "",

    // Education
    educationLevel: userData.educationLevel || "",
    institution: userData.institution || "",
    fieldOfStudy: userData.fieldOfStudy || "",
    graduationDate: userData.graduationDate || "",

    // Professional
    careerInterests: userData.careerInterests || "",
    industries: userData.industries || [],

    // Skills
    technicalSkills: userData.technicalSkills || [],
    softSkills: userData.softSkills || [],

    // Experience
    experiences: userData.experiences || [
      {
        title: "",
        company: "",
        duration: "",
        achievements: "",
      },
    ],
  });

  // State for custom skill inputs
  const [newTechnicalSkill, setNewTechnicalSkill] = useState("");
  const [newSoftSkill, setNewSoftSkill] = useState("");
  const [newIndustry, setNewIndustry] = useState("");

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (section, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Handle adding a new custom technical skill
  const addCustomTechnicalSkill = () => {
    if (
      newTechnicalSkill.trim() !== "" &&
      !formData.technicalSkills.includes(newTechnicalSkill.trim())
    ) {
      handleChange("skills", "technicalSkills", [
        ...formData.technicalSkills,
        newTechnicalSkill.trim(),
      ]);
      setNewTechnicalSkill("");
    }
  };

  // Handle adding a new custom soft skill
  const addCustomSoftSkill = () => {
    if (
      newSoftSkill.trim() !== "" &&
      !formData.softSkills.includes(newSoftSkill.trim())
    ) {
      handleChange("skills", "softSkills", [
        ...formData.softSkills,
        newSoftSkill.trim(),
      ]);
      setNewSoftSkill("");
    }
  };

  // Handle adding a new custom industry
  const addCustomIndustry = () => {
    if (
      newIndustry.trim() !== "" &&
      !formData.industries.includes(newIndustry.trim())
    ) {
      handleChange("professional", "industries", [
        ...formData.industries,
        newIndustry.trim(),
      ]);
      setNewIndustry("");
    }
  };

  // Remove a skill or industry
  const removeItem = (type, item) => {
    if (type === "technicalSkill") {
      handleChange(
        "skills",
        "technicalSkills",
        formData.technicalSkills.filter((skill) => skill !== item)
      );
    } else if (type === "softSkill") {
      handleChange(
        "skills",
        "softSkills",
        formData.softSkills.filter((skill) => skill !== item)
      );
    } else if (type === "industry") {
      handleChange(
        "professional",
        "industries",
        formData.industries.filter((ind) => ind !== item)
      );
    }
  };

  // Add a new experience entry
  const addExperience = () => {
    const newExperiences = [
      ...formData.experiences,
      { title: "", company: "", duration: "", achievements: "" },
    ];
    handleChange("experience", "experiences", newExperiences);
  };

  // Remove an experience entry
  const removeExperience = (index) => {
    if (formData.experiences.length > 1) {
      const newExperiences = formData.experiences.filter((_, i) => i !== index);
      handleChange("experience", "experiences", newExperiences);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (isFormValid()) {
      navigate("/dashboard/create-resume", { state: { formData } });
    }
  };

  // Check if required fields are filled
  const isFormValid = () => {
    return (
      formData.fullName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.location.trim() !== "" &&
      formData.educationLevel.trim() !== "" &&
      formData.institution.trim() !== "" &&
      formData.fieldOfStudy.trim() !== "" &&
      formData.careerInterests.trim() !== ""
    );
  };

  // Tech skills options - expanded list
  const techSkillOptions = [
    "JavaScript",
    "React",
    "Angular",
    "Vue",
    "Python",
    "Java",
    "C#",
    "Node.js",
    "Express",
    "Django",
    "Ruby on Rails",
    "PHP",
    "SQL",
    "MongoDB",
    "AWS",
    "Azure",
    "Google Cloud",
    "Docker",
    "Kubernetes",
    "Git",
    "HTML",
    "CSS",
    "TypeScript",
    "Swift",
    "Kotlin",
    "TensorFlow",
    "PyTorch",
    "Data Analysis",
    "Machine Learning",
    "DevOps",
    "CI/CD",
  ];

  // Soft skills options - expanded list
  const softSkillOptions = [
    "Communication",
    "Teamwork",
    "Leadership",
    "Problem Solving",
    "Time Management",
    "Critical Thinking",
    "Adaptability",
    "Creativity",
    "Emotional Intelligence",
    "Conflict Resolution",
    "Project Management",
    "Decision Making",
    "Active Listening",
    "Presentation Skills",
    "Networking",
    "Mentoring",
    "Attention to Detail",
    "Work Ethic",
    "Customer Service",
  ];

  // Industry options - expanded list
  const industryOptions = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "E-commerce",
    "Manufacturing",
    "Retail",
    "Media",
    "Entertainment",
    "Hospitality",
    "Government",
    "Consulting",
    "Telecommunications",
    "Automotive",
    "Energy",
    "Transportation",
    "Aerospace",
    "Agriculture",
    "Pharmaceutical",
  ];

  const gradientBg = "bg-gradient-to-br from-gray-800 via-gray-900 to-black";

  return (
    <div
      className={`flex flex-col items-center justify-center ${gradientBg} p-6 min-h-screen`}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl backdrop-blur-lg bg-gray-800/80 rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-700/50 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-purple-500/20 rounded-full blur-xl"></div>

        <motion.div
          className="flex items-center justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h1
            className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Create Professional Resume
          </motion.h1>
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.6, type: "spring" }}
          >
            <Sparkles size={22} className="text-indigo-400" />
          </motion.div>
        </motion.div>

        <motion.div
          className="space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* Section 1: Personal Information */}
          <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-800/60">
            <button
              onClick={() => toggleSection("personal")}
              className="w-full px-6 py-4 flex items-center justify-between text-left text-gray-100 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-indigo-400 mr-2">🧑‍🎓</span>
                <span className="font-medium">Personal Information</span>
              </div>
              {expandedSection === "personal" ? (
                <ChevronUp size={20} className="text-gray-400" />
              ) : (
                <ChevronDown size={20} className="text-gray-400" />
              )}
            </button>

            {expandedSection === "personal" && (
              <div className="px-6 py-4 space-y-4 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleChange("personal", "fullName", e.target.value)
                      }
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-gray-700/70 backdrop-blur-sm border border-gray-600/70 rounded-lg focus:outline-none text-gray-100 placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Contact Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleChange("personal", "email", e.target.value)
                      }
                      placeholder="john.doe@example.com"
                      className="w-full px-4 py-3 bg-gray-700/70 backdrop-blur-sm border border-gray-600/70 rounded-lg focus:outline-none text-gray-100 placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleChange("personal", "phone", e.target.value)
                      }
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 bg-gray-700/70 backdrop-blur-sm border border-gray-600/70 rounded-lg focus:outline-none text-gray-100 placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Current Location <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        handleChange("personal", "location", e.target.value)
                      }
                      placeholder="New York, NY"
                      className="w-full px-4 py-3 bg-gray-700/70 backdrop-blur-sm border border-gray-600/70 rounded-lg focus:outline-none text-gray-100 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Educational Background */}
          <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-800/60">
            <button
              onClick={() => toggleSection("education")}
              className="w-full px-6 py-4 flex items-center justify-between text-left text-gray-100 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-indigo-400 mr-2">🎓</span>
                <span className="font-medium">Educational Background</span>
              </div>
              {expandedSection === "education" ? (
                <ChevronUp size={20} className="text-gray-400" />
              ) : (
                <ChevronDown size={20} className="text-gray-400" />
              )}
            </button>

            {expandedSection === "education" && (
              <div className="px-6 py-4 space-y-4 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Education Level <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.educationLevel}
                      onChange={(e) =>
                        handleChange(
                          "education",
                          "educationLevel",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 bg-gray-700/70 backdrop-blur-sm border border-gray-600/70 rounded-lg focus:outline-none text-gray-100"
                      required
                    >
                      <option value="">Select Education Level</option>
                      <option value="High School">High School</option>
                      <option value="Associate">Associate's Degree</option>
                      <option value="Bachelor">Bachelor's Degree</option>
                      <option value="Master">Master's Degree</option>
                      <option value="Doctoral">Doctoral Degree</option>
                      <option value="Professional">Professional Degree</option>
                      <option value="Certificate">Certificate Program</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Institution Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) =>
                        handleChange("education", "institution", e.target.value)
                      }
                      placeholder="University of Example"
                      className="w-full px-4 py-3 bg-gray-700/70 backdrop-blur-sm border border-gray-600/70 rounded-lg focus:outline-none text-gray-100 placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Field of Study/Major{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fieldOfStudy}
                      onChange={(e) =>
                        handleChange(
                          "education",
                          "fieldOfStudy",
                          e.target.value
                        )
                      }
                      placeholder="Computer Science"
                      className="w-full px-4 py-3 bg-gray-700/70 backdrop-blur-sm border border-gray-600/70 rounded-lg focus:outline-none text-gray-100 placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Graduation Date
                    </label>
                    <input
                      type="month"
                      value={formData.graduationDate}
                      onChange={(e) =>
                        handleChange(
                          "education",
                          "graduationDate",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 bg-gray-700/70 backdrop-blur-sm border border-gray-600/70 rounded-lg focus:outline-none text-gray-100"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Professional Aspirations */}
          <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-800/60">
            <button
              onClick={() => toggleSection("professional")}
              className="w-full px-6 py-4 flex items-center justify-between text-left text-gray-100 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-indigo-400 mr-2">💼</span>
                <span className="font-medium">Professional Aspirations</span>
              </div>
              {expandedSection === "professional" ? (
                <ChevronUp size={20} className="text-gray-400" />
              ) : (
                <ChevronDown size={20} className="text-gray-400" />
              )}
            </button>

            {expandedSection === "professional" && (
              <div className="px-6 py-4 space-y-4 border-t border-gray-700">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Career Interests <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.careerInterests}
                    onChange={(e) =>
                      handleChange(
                        "professional",
                        "careerInterests",
                        e.target.value
                      )
                    }
                    placeholder="Full Stack Developer, Data Scientist, etc."
                    className="w-full px-4 py-3 bg-gray-700/70 backdrop-blur-sm border border-gray-600/70 rounded-lg focus:outline-none text-gray-100 placeholder-gray-400"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Preferred Industry Sectors
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {industryOptions.map((industry) => (
                      <button
                        key={industry}
                        onClick={() => {
                          const industries = formData.industries.includes(
                            industry
                          )
                            ? formData.industries.filter((i) => i !== industry)
                            : [...formData.industries, industry];
                          handleChange(
                            "professional",
                            "industries",
                            industries
                          );
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          formData.industries.includes(industry)
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="text"
                      value={newIndustry}
                      onChange={(e) => setNewIndustry(e.target.value)}
                      placeholder="Add another industry..."
                      className="flex-1 px-4 py-2 bg-gray-700/70 backdrop-blur-sm border border-gray-600/70 rounded-lg focus:outline-none text-gray-100 placeholder-gray-400"
                      onKeyPress={(e) =>
                        e.key === "Enter" && addCustomIndustry()
                      }
                    />
                    <button
                      onClick={addCustomIndustry}
                      disabled={newIndustry.trim() === ""}
                      className={`ml-2 p-2 rounded-lg ${
                        newIndustry.trim() === ""
                          ? "bg-gray-700 text-gray-500"
                          : "bg-indigo-600 text-white hover:bg-indigo-500"
                      }`}
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  {formData.industries.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-300 mb-2">
                        Selected Industries:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.industries.map((industry) => (
                          <span
                            key={industry}
                            className="px-3 py-1 bg-indigo-600/70 text-white rounded-full text-sm flex items-center"
                          >
                            {industry}
                            <button
                              onClick={() => removeItem("industry", industry)}
                              className="ml-2 hover:text-red-300"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Skills Assessment */}
          <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-800/60">
            <button
              onClick={() => toggleSection("skills")}
              className="w-full px-6 py-4 flex items-center justify-between text-left text-gray-100 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-indigo-400 mr-2">🛠️</span>
                <span className="font-medium">Skills Assessment</span>
              </div>
              {expandedSection === "skills" ? (
                <ChevronUp size={20} className="text-gray-400" />
              ) : (
                <ChevronDown size={20} className="text-gray-400" />
              )}
            </button>

            {expandedSection === "skills" && (
              <div className="px-6 py-4 space-y-6 border-t border-gray-700">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Technical Skills
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2">
                    {techSkillOptions.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => {
                          const skills = formData.technicalSkills.includes(
                            skill
                          )
                            ? formData.technicalSkills.filter(
                                (s) => s !== skill
                              )
                            : [...formData.technicalSkills, skill];
                          handleChange("skills", "technicalSkills", skills);
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          formData.technicalSkills.includes(skill)
                            ? "bg-purple-600 text-white"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="text"
                      value={newTechnicalSkill}
                      onChange={(e) => setNewTechnicalSkill(e.target.value)}
                      placeholder="Add another technical skill..."
                      className="flex-1 px-4 py-2 bg-gray-700/70 backdrop-blur-sm border border-gray-600/70 rounded-lg focus:outline-none text-gray-100 placeholder-gray-400"
                      onKeyPress={(e) =>
                        e.key === "Enter" && addCustomTechnicalSkill()
                      }
                    />
                    <button
                      onClick={addCustomTechnicalSkill}
                      disabled={newTechnicalSkill.trim() === ""}
                      className={`ml-2 p-2 rounded-lg ${
                        newTechnicalSkill.trim() === ""
                          ? "bg-gray-700 text-gray-500"
                          : "bg-purple-600 text-white hover:bg-purple-500"
                      }`}
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  {formData.technicalSkills.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-300 mb-2">
                        Selected Technical Skills:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.technicalSkills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-purple-600/70 text-white rounded-full text-sm flex items-center"
                          >
                            {skill}
                            <button
                              onClick={() =>
                                removeItem("technicalSkill", skill)
                              }
                              className="ml-2 hover:text-red-300"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Soft Skills
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2">
                    {softSkillOptions.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => {
                          const skills = formData.softSkills.includes(skill)
                            ? formData.softSkills.filter((s) => s !== skill)
                            : [...formData.softSkills, skill];
                          handleChange("skills", "softSkills", skills);
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          formData.softSkills.includes(skill)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="text"
                      value={newSoftSkill}
                      onChange={(e) => setNewSoftSkill(e.target.value)}
                      placeholder="Add another soft skill..."
                      className="flex-1 px-4 py-2 bg-gray-700/70 backdrop-blur-sm border border-gray-600/70 rounded-lg focus:outline-none text-gray-100 placeholder-gray-400"
                      onKeyPress={(e) =>
                        e.key === "Enter" && addCustomSoftSkill()
                      }
                    />
                    <button
                      onClick={addCustomSoftSkill}
                      disabled={newSoftSkill.trim() === ""}
                      className={`ml-2 p-2 rounded-lg ${
                        newSoftSkill.trim() === ""
                          ? "bg-gray-700 text-gray-500"
                          : "bg-blue-600 text-white hover:bg-blue-500"
                      }`}
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  {formData.softSkills.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-300 mb-2">
                        Selected Soft Skills:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.softSkills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-blue-600/70 text-white rounded-full text-sm flex items-center"
                          >
                            {skill}
                            <button
                              onClick={() => removeItem("softSkill", skill)}
                              className="ml-2 hover:text-red-300"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Work Experience */}
          <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-800/60">
            <button
              onClick={() => toggleSection("experience")}
              className="w-full px-6 py-4 flex items-center justify-between text-left text-gray-100 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-indigo-400 mr-2">💻</span>
                <span className="font-medium">Work Experience</span>
              </div>
              {expandedSection === "experience" ? (
                <ChevronUp size={20} className="text-gray-400" />
              ) : (
                <ChevronDown size={20} className="text-gray-400" />
              )}
            </button>

            {expandedSection === "experience" && (
              <div className="px-6 py-4 space-y-4 border-t border-gray-700">
                {formData.experiences.map((exp, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-700 rounded-lg space-y-3 relative"
                  >
                    {formData.experiences.length > 1 && (
                      <button
                        onClick={() => removeExperience(index)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-400"
                      >
                        <X size={18} />
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Role Title
                        </label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => {
                            const newExperiences = [...formData.experiences];
                            newExperiences[index].title = e.target.value;
                            handleChange(
                              "experience",
                              "experiences",
                              newExperiences
                            );
                          }}
                          placeholder="Software Engineer Intern"
                          className="w-full px-4 py-3 bg-gray-700/70 backdrop-blur-sm border border-gray-600/70 rounded-lg focus:outline-none text-gray-100 placeholder-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Company/Organization
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const newExperiences = [...formData.experiences];
                            newExperiences[index].company = e.target.value;
                            handleChange(
                              "experience",
                              "experiences",
                              newExperiences
                            );
                          }}
                          placeholder="Tech Company Inc."
                          className="w-full px-4 py-3 bg-gray-700/70 backdrop-blur-sm border border-gray-600/70 rounded-lg focus:outline-none text-gray-100 placeholder-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => {
                            const newExperiences = [...formData.experiences];
                            newExperiences[index].duration = e.target.value;
                            handleChange(
                              "experience",
                              "experiences",
                              newExperiences
                            );
                          }}
                          placeholder="June 2023 - August 2023"
                          className="w-full px-4 py-3 bg-gray-700/70 backdrop-blur-sm border border-gray-600/70 rounded-lg focus:outline-none text-gray-100 placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Key Achievements
                      </label>
                      <textarea
                        value={exp.achievements}
                        onChange={(e) => {
                          const newExperiences = [...formData.experiences];
                          newExperiences[index].achievements = e.target.value;
                          handleChange(
                            "experience",
                            "experiences",
                            newExperiences
                          );
                        }}
                        placeholder="• Developed a feature that improved performance by 30%
• Collaborated with team members to implement new functionality"
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-700/70 backdrop-blur-sm border border-gray-600/70 rounded-lg focus:outline-none text-gray-100 placeholder-gray-400"
                      />
                    </div>
                  </div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addExperience}
                  className="w-full py-2 px-4 rounded-lg font-medium text-indigo-300 border border-indigo-700/50 hover:bg-indigo-700/20 transition-all duration-300 flex items-center justify-center"
                >
                  <Plus size={18} className="mr-2" /> Add Another Experience
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="flex justify-between items-center pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-all duration-300 border border-gray-600/50 shadow-md"
          >
            Back
          </motion.button>

          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={`py-3 px-6 rounded-xl font-medium text-white shadow-lg flex items-center ${
              isFormValid()
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                : "bg-gradient-to-r from-indigo-800 to-purple-800 opacity-50 cursor-not-allowed"
            } transition-all duration-300`}
            disabled={!isFormValid()}
          >
            <CheckCircle size={18} className="mr-2" />
            Create Resume
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-gray-400 pt-4"
        >
          <div className="flex items-center justify-center">
            <span className="text-red-400 mr-1">*</span>
            <span>Required fields</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResumeForm;
