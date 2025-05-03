import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Save,
  Download,
  User,
  BookOpen,
  Briefcase,
  Code,
  Star,
  Award,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Languages,
} from "lucide-react";

export default function Overview() {
  const [sections, setSections] = useState({
    personalInfo: true,
    education: true,
    aspirations: true,
  });
    const location = useLocation();
    const { email, password } = location.state || {}; // Retrieve email and password

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: "",
      dateOfBirth: "",
      location: "",
      email: "",
      phone: "",
      language: "",
    },
    education: {
      educationLevel: "Undergraduate",
      institution: "Meghnad Saha Institute of Technology",
      fieldOfStudy: "Computer Science",
      graduationDate: "2025-06",
      gpa: "3.8",
      achievements: "Dean's List, Scholarship Recipient",
    },
    aspirations: {
      careerInterests: "Full Stack Developer",
      industrySectors: ["Technology", "Finance"],
      shortTermGoals: "Build a strong portfolio and gain industry experience.",
      longTermGoals: "Become a senior developer and lead a tech team.",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/fetch-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            fullName: data.fullName,
            dateOfBirth: data.dateOfBirth,
            location: data.location,
            email: data.email,
            phone: data.phone,
            language: data.language,
          },
        }));
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  });

  const toggleSection = (section) => {
    setSections({
      ...sections,
      [section]: !sections[section],
    });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saved Data:", formData);
  };

  const completionPercentage = 99;


  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Student Profile</h1>
        <div className="flex items-center gap-4">
          <div className="w-64 bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">
            {completionPercentage}% Complete
          </span>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
            <Download size={16} />
            <span>Export Profile</span>
          </button>
        </div>
      </div>

      {/* Section 1: Personal Information */}
      <div className="mb-6 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div
          className="flex justify-between items-center p-4 bg-gray-800 cursor-pointer"
          onClick={() => toggleSection("personalInfo")}
        >
          <div className="flex items-center gap-2">
            <User className="text-blue-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-300">
              Personal Information
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-2 text-gray-300 hover:text-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                isEditing ? handleSave() : handleEditToggle();
              }}
            >
              {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
            </button>
            {sections.personalInfo ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </div>
        </div>

        {sections.personalInfo && (
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.personalInfo.fullName}
                    onChange={(e) =>
                      handleInputChange("personalInfo", "fullName", e.target.value)
                    }
                    disabled={!isEditing}
                    className={`w-full border ${
                      isEditing ? "border-blue-500" : "border-gray-800"
                    } rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                      isEditing ? "focus:ring-blue-500" : ""
                    } bg-black text-gray-300`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.personalInfo.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange("personalInfo", "dateOfBirth", e.target.value)
                      }
                      disabled={!isEditing}
                      className={`w-full border ${
                        isEditing ? "border-blue-500" : "border-gray-800"
                      } rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                        isEditing ? "focus:ring-blue-500" : ""
                      } bg-black text-gray-300`}
                    />
                    <Calendar
                      className="absolute right-3 top-2.5 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Current Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.personalInfo.location}
                      onChange={(e) =>
                        handleInputChange("personalInfo", "location", e.target.value)
                      }
                      disabled={!isEditing}
                      className={`w-full border ${
                        isEditing ? "border-blue-500" : "border-gray-800"
                      } rounded-md px-3 py-2 pl-10 focus:outline-none focus:ring-2 ${
                        isEditing ? "focus:ring-blue-500" : ""
                      } bg-black text-gray-300`}
                    />
                    <MapPin
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Contact Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.personalInfo.email}
                      onChange={(e) =>
                        handleInputChange("personalInfo", "email", e.target.value)
                      }
                      disabled={!isEditing}
                      className={`w-full border ${
                        isEditing ? "border-blue-500" : "border-gray-800"
                      } rounded-md px-3 py-2 pl-10 focus:outline-none focus:ring-2 ${
                        isEditing ? "focus:ring-blue-500" : ""
                      } bg-black text-gray-300`}
                    />
                    <Mail
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={formData.personalInfo.phone}
                      onChange={(e) =>
                        handleInputChange("personalInfo", "phone", e.target.value)
                      }
                      disabled={!isEditing}
                      className={`w-full border ${
                        isEditing ? "border-blue-500" : "border-gray-800"
                      } rounded-md px-3 py-2 pl-10 focus:outline-none focus:ring-2 ${
                        isEditing ? "focus:ring-blue-500" : ""
                      } bg-black text-gray-300`}
                    />
                    <Phone
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Preferred Language(s)
                  </label>
                  <div className="relative">
                    <select
                      value={formData.personalInfo.language}
                      onChange={(e) =>
                        handleInputChange("personalInfo", "language", e.target.value)
                      }
                      disabled={!isEditing}
                      className={`w-full border ${
                        isEditing ? "border-blue-500" : "border-gray-800"
                      } rounded-md px-3 py-2 pl-10 focus:outline-none focus:ring-2 ${
                        isEditing ? "focus:ring-blue-500" : ""
                      } appearance-none bg-black text-gray-300`}
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>Mandarin</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                    <Languages
                      className="absolute left-3 top-2.5 text-gray-400"
                      size={18}
                    />
                    <ChevronDown
                      className="absolute right-3 top-2.5 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Educational Background */}
      <div className="mb-6 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div
          className="flex justify-between items-center p-4 bg-gray-800 cursor-pointer"
          onClick={() => toggleSection("education")}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="text-blue-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-300">
              Educational Background
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-2 text-gray-300 hover:text-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                isEditing ? handleSave() : handleEditToggle();
              }}
            >
              {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
            </button>
            {sections.education ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </div>
        </div>

        {sections.education && (
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Current Education Level
                </label>
                <select
                  value={formData.education.educationLevel}
                  onChange={(e) =>
                    handleInputChange("education", "educationLevel", e.target.value)
                  }
                  disabled={!isEditing}
                  className={`w-full border ${
                    isEditing ? "border-blue-500" : "border-gray-800"
                  } rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                    isEditing ? "focus:ring-blue-500" : ""
                  } bg-black text-gray-300`}
                >
                  <option>High School</option>
                  <option>Undergraduate</option>
                  <option>Postgraduate</option>
                  <option>Doctoral</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    value={formData.education.institution}
                    onChange={(e) =>
                      handleInputChange("education", "institution", e.target.value)
                    }
                    disabled={!isEditing}
                    className={`w-full border ${
                      isEditing ? "border-blue-500" : "border-gray-800"
                    } rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                      isEditing ? "focus:ring-blue-500" : ""
                    } bg-black text-gray-300`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Field of Study/Major
                  </label>
                  <input
                    type="text"
                    value={formData.education.fieldOfStudy}
                    onChange={(e) =>
                      handleInputChange("education", "fieldOfStudy", e.target.value)
                    }
                    disabled={!isEditing}
                    className={`w-full border ${
                      isEditing ? "border-blue-500" : "border-gray-800"
                    } rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                      isEditing ? "focus:ring-blue-500" : ""
                    } bg-black text-gray-300`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Expected Graduation Date
                  </label>
                  <input
                    type="month"
                    value={formData.education.graduationDate}
                    onChange={(e) =>
                      handleInputChange("education", "graduationDate", e.target.value)
                    }
                    disabled={!isEditing}
                    className={`w-full border ${
                      isEditing ? "border-blue-500" : "border-gray-800"
                    } rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                      isEditing ? "focus:ring-blue-500" : ""
                    } bg-black text-gray-300`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Current GPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={formData.education.gpa}
                    onChange={(e) =>
                      handleInputChange("education", "gpa", e.target.value)
                    }
                    disabled={!isEditing}
                    className={`w-full border ${
                      isEditing ? "border-blue-500" : "border-gray-800"
                    } rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                      isEditing ? "focus:ring-blue-500" : ""
                    } bg-black text-gray-300`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Academic Achievements
                </label>
                <textarea
                  value={formData.education.achievements}
                  onChange={(e) =>
                    handleInputChange("education", "achievements", e.target.value)
                  }
                  disabled={!isEditing}
                  className={`w-full border ${
                    isEditing ? "border-blue-500" : "border-gray-800"
                  } rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                    isEditing ? "focus:ring-blue-500" : ""
                  } h-24 bg-black text-gray-300`}
                ></textarea>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Professional Aspirations */}
      <div className="mb-6 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div
          className="flex justify-between items-center p-4 bg-gray-800 cursor-pointer"
          onClick={() => toggleSection("aspirations")}
        >
          <div className="flex items-center gap-2">
            <Briefcase className="text-blue-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-300">
              Professional Aspirations
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-2 text-gray-300 hover:text-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                isEditing ? handleSave() : handleEditToggle();
              }}
            >
              {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
            </button>
            {sections.aspirations ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </div>
        </div>

        {sections.aspirations && (
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Career Interests
                </label>
                <input
                  type="text"
                  value={formData.aspirations.careerInterests}
                  onChange={(e) =>
                    handleInputChange("aspirations", "careerInterests", e.target.value)
                  }
                  disabled={!isEditing}
                  className={`w-full border ${
                    isEditing ? "border-blue-500" : "border-gray-800"
                  } rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                    isEditing ? "focus:ring-blue-500" : ""
                  } bg-black text-gray-300`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Preferred Industry Sectors
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.aspirations.industrySectors.map((sector, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-black text-[#a398a3] rounded-full text-sm"
                    >
                      {sector}
                    </span>
                  ))}
                  <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                    + Add More
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Short-term Goals (1–2 yrs)
                  </label>
                  <textarea
                    value={formData.aspirations.shortTermGoals}
                    onChange={(e) =>
                      handleInputChange("aspirations", "shortTermGoals", e.target.value)
                    }
                    disabled={!isEditing}
                    className={`w-full border ${
                      isEditing ? "border-blue-500" : "border-gray-800"
                    } rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                      isEditing ? "focus:ring-blue-500" : ""
                    } h-24 bg-black text-gray-300`}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Long-term Objectives (5–10 yrs)
                  </label>
                  <textarea
                    value={formData.aspirations.longTermGoals}
                    onChange={(e) =>
                      handleInputChange("aspirations", "longTermGoals", e.target.value)
                    }
                    disabled={!isEditing}
                    className={`w-full border ${
                      isEditing ? "border-blue-500" : "border-gray-800"
                    } rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                      isEditing ? "focus:ring-blue-500" : ""
                    } h-24 bg-black text-gray-300`}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 4: Skills Assessment */}
      <div className="mb-6 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div
          className="flex justify-between items-center p-4 bg-gray-800 cursor-pointer"
          onClick={() => toggleSection("skills")}
        >
          <div className="flex items-center gap-2">
            <Code className="text-blue-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-300">
              Skills Assessment
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-blue-600">
              <Edit2 size={18} />
            </button>
            {sections.skills ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </div>
        </div>

        {sections.skills && (
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-300 mb-3">
                  Technical Skills
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <span className="text-sm font-medium text-gray-300">
                        Python
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                      </div>
                    </div>
                    <div className="w-24 text-right">
                      <span className="text-sm text-gray-600">Advanced</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <span className="text-sm font-medium text-gray-300">
                        Java
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full w-1/2"></div>
                      </div>
                    </div>
                    <div className="w-24 text-right">
                      <span className="text-sm text-gray-600">
                        Intermediate
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <span className="text-sm font-medium text-gray-300">
                        React
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full w-11/12"></div>
                      </div>
                    </div>
                    <div className="w-24 text-right">
                      <span className="text-sm text-gray-600">Expert</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-300 mb-3">Soft Skills</h3>

                <div className="flex flex-wrap gap-2">
                  <div className="px-4 py-2 bg-green-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-green-800">
                        Communication
                      </span>
                      <div className="flex">
                        <Star
                          className="fill-green-500 text-green-500"
                          size={16}
                        />
                        <Star
                          className="fill-green-500 text-green-500"
                          size={16}
                        />
                        <Star
                          className="fill-green-500 text-green-500"
                          size={16}
                        />
                        <Star
                          className="fill-green-500 text-green-500"
                          size={16}
                        />
                        <Star className="text-green-300" size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-2 bg-purple-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-purple-800">
                        Leadership
                      </span>
                      <div className="flex">
                        <Star
                          className="fill-purple-500 text-purple-500"
                          size={16}
                        />
                        <Star
                          className="fill-purple-500 text-purple-500"
                          size={16}
                        />
                        <Star
                          className="fill-purple-500 text-purple-500"
                          size={16}
                        />
                        <Star className="text-purple-300" size={16} />
                        <Star className="text-purple-300" size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 5: Work Experience */}
      <div className="mb-6 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div
          className="flex justify-between items-center p-4 bg-gray-800 cursor-pointer"
          onClick={() => toggleSection("experience")}
        >
          <div className="flex items-center gap-2">
            <Briefcase className="text-blue-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-300">
              Work Experience
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-blue-600">
              <Edit2 size={18} />
            </button>
            {sections.experience ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </div>
        </div>

        {sections.experience && (
          <div className="p-6">
            {/* Work Experience Timeline */}
            <div className="relative pb-12">
              <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200"></div>

              <div className="relative flex gap-4 mb-8">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center z-10">
                  <Briefcase className="text-blue-600" size={24} />
                </div>
                <div className="flex-1 bg-gray-800 p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-300">
                        Software Engineering Intern
                      </h3>
                      <p className="text-gray-400">TechCorp Inc.</p>
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                      Jun 2024 - Present
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm text-gray-400 list-disc list-inside">
                    <li>
                      Developed features for the company's main web application
                    </li>
                    <li>Collaborated with senior engineers on code reviews</li>
                    <li>Implemented responsive UI components using React</li>
                  </ul>
                </div>
              </div>

              <div className="relative flex gap-4 mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center z-10">
                  <Award className="text-green-600" size={24} />
                </div>
                <div className="flex-1 bg-gray-800 p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-300">
                        Research Assistant
                      </h3>
                      <p className="text-gray-300">University AI Lab</p>
                    </div>
                    <span className="text-sm font-medium text-gray-400">
                      Sep 2023 - May 2024
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm text-gray-400 list-disc list-inside">
                    <li>
                      Assisted PhD students with machine learning research
                    </li>
                    <li>Collected and processed large datasets</li>
                    <li>
                      Co-authored a research paper presented at a student
                      conference
                    </li>
                  </ul>
                </div>
              </div>

              <button className="ml-8 text-blue-600 font-medium flex items-center gap-1">
                <span>Add Experience</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add button for collapsed sections */}
      <div className="text-center mt-8">
        <button className="px-6 py-3 bg-gray-800 border border-gray-200 rounded-full text-gray-300 font-medium hover:bg-gray-100 transition-colors">
          Show More Sections
        </button>
      </div>
    </div>
  );
}
