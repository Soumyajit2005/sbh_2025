import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Download,
  Palette,
  Layout,
  Edit,
  User,
  BookOpen,
  Briefcase,
  Award,
  Code,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { creativeThumbnail, modernThumbnail, professionalThumbnail, minimalThumbnail } from "@Assets";

const CreateResume = () => {
  const location = useLocation();
  const initialFormData = location.state?.formData || {};
  const [formData, setFormData] = useState(initialFormData);
  const [activeSection, setActiveSection] = useState("template");
  const [template, setTemplate] = useState("modern");
  const [color, setColor] = useState("#3b82f6"); // Default blue
  const [font, setFont] = useState("Inter");
  const [spacing, setSpacing] = useState("normal");
  const [isDownloading, setIsDownloading] = useState(false);
  const resumeRef = useRef(null);

  const templates = [
    { id: "modern", name: "Modern", image: modernThumbnail },
    { id: "professional", name: "Professional", image: professionalThumbnail },
    { id: "creative", name: "Creative", image: creativeThumbnail },
    { id: "minimal", name: "Minimal", image: minimalThumbnail },
  ];

  const colors = [
    { id: "#3b82f6", name: "Blue" },
    { id: "#10b981", name: "Green" },
    { id: "#f43f5e", name: "Red" },
    { id: "#8b5cf6", name: "Purple" },
    { id: "#f59e0b", name: "Orange" },
    { id: "#3b82f6", name: "Sky Blue" },
    { id: "#eab308", name: "Yellow" },
    { id: "#6366f1", name: "Indigo" },
    { id: "#d97706", name: "Amber" },
    { id: "#4ade80", name: "Emerald" },
    { id: "#f97316", name: "Amber" },
    { id: "#ec4899", name: "Pink" },
    { id: "#a855f7", name: "Violet" },
  ];

  const fonts = [
    { id: "Inter", name: "Inter" },
    { id: "Georgia", name: "Georgia" },
    { id: "Arial", name: "Arial" },
    { id: "Courier New", name: "Courier" },
    { id: "Times New Roman", name: "Times" },
    { id: "Verdana", name: "Verdana" },
    { id: "Tahoma", name: "Tahoma" },
    { id: "Trebuchet MS", name: "Trebuchet" },
  ];

  const spacingOptions = [
    { id: "compact", name: "Compact" },
    { id: "normal", name: "Normal" },
    { id: "relaxed", name: "Relaxed" },
  ];

  const downloadResume = async () => {
    if (!resumeRef.current) return;

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${formData.fullName || "resume"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to download resume. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const updateFormData = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateNestedFormData = (section, index, key, value) => {
    setFormData((prev) => {
      const sectionData = [...prev[section]];
      sectionData[index] = {
        ...sectionData[index],
        [key]: value,
      };
      return {
        ...prev,
        [section]: sectionData,
      };
    });
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { title: "", company: "", duration: "", achievements: "" },
      ],
    }));
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  const addSkill = (skillType) => {
    setFormData((prev) => ({
      ...prev,
      [skillType]: [...prev[skillType], ""],
    }));
  };

  const updateSkill = (skillType, index, value) => {
    setFormData((prev) => {
      const skills = [...prev[skillType]];
      skills[index] = value;
      return {
        ...prev,
        [skillType]: skills,
      };
    });
  };

  const removeSkill = (skillType, index) => {
    setFormData((prev) => ({
      ...prev,
      [skillType]: prev[skillType].filter((_, i) => i !== index),
    }));
  };

  // Editor Component
  const Editor = () => {
    return (
      <div className="bg-gray-700 rounded-lg shadow overflow-hidden h-full">
        <div className="flex border-b">
          <button
            onClick={() => setActiveSection("template")}
            className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${
              activeSection === "template"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-300"
            }`}
          >
            <Layout size={16} /> Template
          </button>
          <button
            onClick={() => setActiveSection("style")}
            className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${
              activeSection === "style"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-300"
            }`}
          >
            <Palette size={16} /> Style
          </button>
          <button
            onClick={() => setActiveSection("content")}
            className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${
              activeSection === "content"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-300"
            }`}
          >
            <Edit size={16} /> Content
          </button>
        </div>
        <div className="p-5 h-full overflow-y-auto pb-40 bg-gray-800">
          {activeSection === "template" && (
            <div>
              <h3 className="text-lg font-medium mb-4 text-white">
                Choose Template
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {templates.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`border rounded-lg p-3 cursor-pointer hover:bg-gray-700 ${
                      template === t.id
                        ? "border-blue-500 ring-2 ring-blue-100"
                        : "border-gray-600"
                    }`}
                  >
                    <div className="h-24 bg-gray-700 mb-2 flex items-center justify-center text-gray-400">
                      <img src={t.image} alt="template image" className="w-full h-full rounded-lg" />
                    </div>
                    <p className="text-sm font-medium text-center text-white">
                      {t.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "style" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4 text-white">
                  Color Scheme
                </h3>
                <div className="flex flex-wrap gap-3">
                  {colors.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setColor(c.id)}
                      className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center ${
                        color === c.id
                          ? "ring-2 ring-offset-2 ring-gray-700"
                          : ""
                      }`}
                      style={{ backgroundColor: c.id }}
                    />
                  ))}
                  <div>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-8 h-8 cursor-pointer rounded overflow-hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4 text-white">
                  Font Family
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {fonts.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => setFont(f.id)}
                      className={`border rounded-lg p-3 cursor-pointer text-center ${
                        font === f.id
                          ? "border-blue-500 bg-blue-50 text-black"
                          : "border-gray-600 text-white"
                      }`}
                      style={{ fontFamily: f.id }}
                    >
                      {f.name}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4 text-white">Spacing</h3>
                <div className="grid grid-cols-3 gap-3">
                  {spacingOptions.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setSpacing(s.id)}
                      className={`border rounded-lg p-3 cursor-pointer text-center text-sm ${
                        spacing === s.id
                          ? "border-blue-500 bg-blue-50 text-black"
                          : "border-gray-600 text-white"
                      }`}
                    >
                      {s.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "content" && (
            <div className="space-y-8">
              <div>
                <div className="flex items-center mb-4">
                  <User size={18} className="mr-2 text-gray-300" />
                  <h3 className="text-lg font-medium text-white">
                    Personal Information
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName || ""}
                      onChange={(e) =>
                        updateFormData("fullName", e.target.value)
                      }
                      className="w-full p-2 border rounded-md bg-gray-800 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) =>
                          updateFormData("email", e.target.value)
                        }
                        className="w-full p-2 border rounded-md bg-gray-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={formData.phone || ""}
                        onChange={(e) =>
                          updateFormData("phone", e.target.value)
                        }
                        className="w-full p-2 border rounded-md bg-gray-800 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location || ""}
                      onChange={(e) =>
                        updateFormData("location", e.target.value)
                      }
                      className="w-full p-2 border rounded-md bg-gray-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Career Objective
                    </label>
                    <textarea
                      value={formData.careerInterests || ""}
                      onChange={(e) =>
                        updateFormData("careerInterests", e.target.value)
                      }
                      className="w-full p-2 border rounded-md bg-gray-800 text-white"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <BookOpen size={18} className="mr-2 text-gray-300" />
                  <h3 className="text-lg font-medium text-white">Education</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={formData.educationLevel || ""}
                      onChange={(e) =>
                        updateFormData("educationLevel", e.target.value)
                      }
                      className="w-full p-2 border rounded-md bg-gray-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={formData.institution || ""}
                      onChange={(e) =>
                        updateFormData("institution", e.target.value)
                      }
                      className="w-full p-2 border rounded-md bg-gray-800 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Field of Study
                      </label>
                      <input
                        type="text"
                        value={formData.fieldOfStudy || ""}
                        onChange={(e) =>
                          updateFormData("fieldOfStudy", e.target.value)
                        }
                        className="w-full p-2 border rounded-md bg-gray-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Graduation Date
                      </label>
                      <input
                        type="month"
                        value={formData.graduationDate || ""}
                        onChange={(e) =>
                          updateFormData("graduationDate", e.target.value)
                        }
                        className="w-full p-2 border rounded-md bg-gray-800 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <Briefcase size={18} className="mr-2 text-gray-300" />
                  <h3 className="text-lg font-medium text-white">
                    Work Experience
                  </h3>
                </div>
                {formData.experiences &&
                  formData.experiences.map((exp, index) => (
                    <div key={index} className="p-4 border rounded-md mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-white">
                          Experience {index + 1}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeExperience(index);
                          }}
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Job Title
                          </label>
                          <input
                            type="text"
                            value={exp.title || ""}
                            onChange={(e) =>
                              updateNestedFormData(
                                "experiences",
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border rounded-md bg-gray-800 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            value={exp.company || ""}
                            onChange={(e) =>
                              updateNestedFormData(
                                "experiences",
                                index,
                                "company",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border rounded-md bg-gray-800 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={exp.duration || ""}
                            onChange={(e) =>
                              updateNestedFormData(
                                "experiences",
                                index,
                                "duration",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border rounded-md bg-gray-800 text-white"
                            placeholder="e.g., Jan 2020 - Present"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Achievements/Responsibilities
                          </label>
                          <textarea
                            value={exp.achievements || ""}
                            onChange={(e) =>
                              updateNestedFormData(
                                "experiences",
                                index,
                                "achievements",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border rounded-md bg-gray-800 text-white"
                            rows={3}
                            placeholder="Describe your key achievements..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addExperience();
                  }}
                  className="w-full py-2 border border-dashed border-gray-300 rounded-md text-gray-300 hover:text-gray-300 hover:border-gray-400"
                >
                  + Add Experience
                </button>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <Code size={18} className="mr-2 text-gray-300" />
                  <h3 className="text-lg font-medium text-white">
                    Technical Skills
                  </h3>
                </div>
                <div className="space-y-3">
                  {formData.technicalSkills &&
                    formData.technicalSkills.map((skill, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) =>
                            updateSkill(
                              "technicalSkills",
                              index,
                              e.target.value
                            )
                          }
                          className="flex-1 p-2 border rounded-md bg-gray-800 text-white"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeSkill("technicalSkills", index);
                          }}
                          className="ml-2 text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addSkill("technicalSkills");
                    }}
                    className="w-full py-2 border border-dashed border-gray-300 rounded-md text-gray-300 hover:text-gray-300 hover:border-gray-400"
                  >
                    + Add Technical Skill
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <Award size={18} className="mr-2 text-gray-300" />
                  <h3 className="text-lg font-medium text-white">
                    Soft Skills
                  </h3>
                </div>
                <div className="space-y-3">
                  {formData.softSkills &&
                    formData.softSkills.map((skill, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) =>
                            updateSkill("softSkills", index, e.target.value)
                          }
                          className="flex-1 p-2 border rounded-md bg-gray-800 text-white"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeSkill("softSkills", index);
                          }}
                          className="ml-2 text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addSkill("softSkills");
                    }}
                    className="w-full py-2 border border-dashed border-gray-300 rounded-md text-gray-300 hover:text-gray-300 hover:border-gray-400"
                  >
                    + Add Soft Skill
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Modern Resume Template
  const ModernTemplate = () => (
    <div className="bg-gray-900" style={{ fontFamily: font }}>
      <div className="p-8" style={{ backgroundColor: color }}>
        <div className="text-white">
          <h1 className="text-3xl font-bold">
            {formData.fullName || "Your Name"}
          </h1>
          <div
            className={`mt-2 ${spacing === "compact" ? "space-y-1" : spacing === "relaxed" ? "space-y-3" : "space-y-2"}`}
          >
            <p>{formData.email}</p>
            <p>{formData.phone}</p>
            <p>{formData.location}</p>
          </div>
        </div>
      </div>

      <div
        className={`p-8 ${spacing === "compact" ? "space-y-4" : spacing === "relaxed" ? "space-y-8" : "space-y-6"}`}
      >
        {formData.careerInterests && (
          <div>
            <h2
              className="text-xl font-bold border-b-2 pb-2 mb-3"
              style={{ borderColor: color }}
            >
              CAREER OBJECTIVE
            </h2>
            <p>{formData.careerInterests}</p>
          </div>
        )}

        <div>
          <h2
            className="text-xl font-bold border-b-2 pb-2 mb-3"
            style={{ borderColor: color }}
          >
            EDUCATION
          </h2>
          <div>
            <h3 className="font-bold">
              {formData.educationLevel} in {formData.fieldOfStudy}
            </h3>
            <p className="font-medium">{formData.institution}</p>
            <p className="text-gray-300">
              Graduation:{" "}
              {formData.graduationDate
                ? new Date(formData.graduationDate).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "long" }
                  )
                : ""}
            </p>
          </div>
        </div>

        {formData.experiences && formData.experiences.length > 0 && (
          <div>
            <h2
              className="text-xl font-bold border-b-2 pb-2 mb-3"
              style={{ borderColor: color }}
            >
              WORK EXPERIENCE
            </h2>
            <div
              className={`${spacing === "compact" ? "space-y-3" : spacing === "relaxed" ? "space-y-6" : "space-y-4"}`}
            >
              {formData.experiences.map((exp, index) => (
                <div key={index}>
                  <h3 className="font-bold">{exp.title}</h3>
                  <p className="font-medium">{exp.company}</p>
                  <p className="text-gray-300">{exp.duration}</p>
                  <p className="mt-1 whitespace-pre-line">{exp.achievements}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {formData.technicalSkills && formData.technicalSkills.length > 0 && (
            <div>
              <h2
                className="text-xl font-bold border-b-2 pb-2 mb-3"
                style={{ borderColor: color }}
              >
                TECHNICAL SKILLS
              </h2>
              <ul className="list-disc pl-5">
                {formData.technicalSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          )}

          {formData.softSkills && formData.softSkills.length > 0 && (
            <div>
              <h2
                className="text-xl font-bold border-b-2 pb-2 mb-3"
                style={{ borderColor: color }}
              >
                SOFT SKILLS
              </h2>
              <ul className="list-disc pl-5">
                {formData.softSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Professional Template
  const ProfessionalTemplate = () => (
    <div className="bg-gray-900" style={{ fontFamily: font }}>
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold">
          {formData.fullName || "Your Name"}
        </h1>
        <div
          className={`mt-3 text-gray-300 flex justify-center ${spacing === "compact" ? "space-x-3" : spacing === "relaxed" ? "space-x-6" : "space-x-4"}`}
        >
          <p>{formData.email}</p>
          <p>|</p>
          <p>{formData.phone}</p>
          <p>|</p>
          <p>{formData.location}</p>
        </div>
        <div
          className="mt-4 w-20 h-1 mx-auto"
          style={{ backgroundColor: color }}
        ></div>
      </div>

      <div
        className={`px-8 pb-8 ${spacing === "compact" ? "space-y-4" : spacing === "relaxed" ? "space-y-8" : "space-y-6"}`}
      >
        {formData.careerInterests && (
          <div>
            <h2 className="text-lg font-bold uppercase mb-2" style={{ color }}>
              Career Objective
            </h2>
            <p>{formData.careerInterests}</p>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold uppercase mb-2" style={{ color }}>
            Education
          </h2>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold">
                {formData.educationLevel} in {formData.fieldOfStudy}
              </h3>
              <p>{formData.institution}</p>
            </div>
            <p>
              {formData.graduationDate
                ? new Date(formData.graduationDate).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "long" }
                  )
                : ""}
            </p>
          </div>
        </div>

        {formData.experiences && formData.experiences.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase mb-2" style={{ color }}>
              Professional Experience
            </h2>
            <div
              className={`${spacing === "compact" ? "space-y-3" : spacing === "relaxed" ? "space-y-6" : "space-y-4"}`}
            >
              {formData.experiences.map((exp, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{exp.title}</h3>
                    <p>{exp.company}</p>
                    <p className="mt-1 whitespace-pre-line">
                      {exp.achievements}
                    </p>
                  </div>
                  <p className="text-gray-300">{exp.duration}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {formData.technicalSkills && formData.technicalSkills.length > 0 && (
            <div>
              <h2
                className="text-lg font-bold uppercase mb-2"
                style={{ color }}
              >
                Technical Skills
              </h2>
              <div className="flex flex-wrap">
                {formData.technicalSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="mr-2 mb-2 px-3 py-1 bg-gray-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {formData.softSkills && formData.softSkills.length > 0 && (
            <div>
              <h2
                className="text-lg font-bold uppercase mb-2"
                style={{ color }}
              >
                Soft Skills
              </h2>
              <div className="flex flex-wrap">
                {formData.softSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="mr-2 mb-2 px-3 py-1 bg-gray-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Creative Template
  const CreativeTemplate = () => (
    <div className="flex bg-gray-900" style={{ fontFamily: font }}>
      <div className="w-1/3 p-6" style={{ backgroundColor: color }}>
        <div className="text-white">
          <h1 className="text-2xl font-bold">
            {formData.fullName || "Your Name"}
          </h1>
          <div
            className={`mt-4 ${spacing === "compact" ? "space-y-2" : spacing === "relaxed" ? "space-y-4" : "space-y-3"}`}
          >
            <div>
              <h2 className="text-sm font-bold uppercase mb-1">Contact</h2>
              <p className="text-sm">{formData.email}</p>
              <p className="text-sm">{formData.phone}</p>
              <p className="text-sm">{formData.location}</p>
            </div>

            {formData.technicalSkills &&
              formData.technicalSkills.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold uppercase mb-1">
                    Technical Skills
                  </h2>
                  <ul className="list-disc pl-5 text-sm">
                    {formData.technicalSkills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}

            {formData.softSkills && formData.softSkills.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase mb-1">
                  Soft Skills
                </h2>
                <ul className="list-disc pl-5 text-sm">
                  {formData.softSkills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`w-2/3 p-6 ${spacing === "compact" ? "space-y-4" : spacing === "relaxed" ? "space-y-8" : "space-y-6"}`}
      >
        {formData.careerInterests && (
          <div>
            <h2 className="text-xl font-bold uppercase" style={{ color }}>
              About Me
            </h2>
            <div
              className="w-16 h-1 mt-1 mb-3"
              style={{ backgroundColor: color }}
            ></div>
            <p>{formData.careerInterests}</p>
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold uppercase" style={{ color }}>
            Education
          </h2>
          <div
            className="w-16 h-1 mt-1 mb-3"
            style={{ backgroundColor: color }}
          ></div>
          <div>
            <h3 className="font-bold">
              {formData.educationLevel} in {formData.fieldOfStudy}
            </h3>
            <p>{formData.institution}</p>
            <p className="text-gray-600 text-sm">
              Graduation:{" "}
              {formData.graduationDate
                ? new Date(formData.graduationDate).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "long" }
                  )
                : ""}
            </p>
          </div>
        </div>

        {formData.experiences && formData.experiences.length > 0 && (
          <div>
            <h2 className="text-xl font-bold uppercase" style={{ color }}>
              Experience
            </h2>
            <div
              className="w-16 h-1 mt-1 mb-3"
              style={{ backgroundColor: color }}
            ></div>
            <div
              className={`${spacing === "compact" ? "space-y-3" : spacing === "relaxed" ? "space-y-6" : "space-y-4"}`}
            >
              {formData.experiences.map((exp, index) => (
                <div key={index}>
                  <h3 className="font-bold">{exp.title}</h3>
                  <p className="font-medium">{exp.company}</p>
                  <p className="text-gray-600 text-sm">{exp.duration}</p>
                  <p className="mt-1 text-sm whitespace-pre-line">
                    {exp.achievements}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const MinimalTemplate = () => (
    <div className="bg-gray-900" style={{ fontFamily: font }}>
      <div className="p-8">
        <h1 className="text-3xl font-bold" style={{ color }}>
          {formData.fullName || "Your Name"}
        </h1>
        <div
          className={`mt-2 text-gray-300 flex ${spacing === "compact" ? "space-x-3" : spacing === "relaxed" ? "space-x-5" : "space-x-4"}`}
        >
          <p>{formData.email}</p>
          <p>•</p>
          <p>{formData.phone}</p>
          <p>•</p>
          <p>{formData.location}</p>
        </div>
      </div>

      <div
        className={`px-8 pb-8 ${spacing === "compact" ? "space-y-4" : spacing === "relaxed" ? "space-y-8" : "space-y-6"}`}
      >
        {formData.careerInterests && (
          <div>
            <h2 className="text-lg font-bold" style={{ color }}>
              PROFILE
            </h2>
            <hr className="mt-1 mb-2" />
            <p>{formData.careerInterests}</p>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold" style={{ color }}>
            EDUCATION
          </h2>
          <hr className="mt-1 mb-2" />
          <p className="font-bold">
            {formData.educationLevel} in {formData.fieldOfStudy}
          </p>
          <p>{formData.institution}</p>
          <p className="text-gray-200">
            {formData.graduationDate
              ? new Date(formData.graduationDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })
              : ""}
          </p>
        </div>

        {formData.experiences && formData.experiences.length > 0 && (
          <div>
            <h2 className="text-lg font-bold" style={{ color }}>
              EXPERIENCE
            </h2>
            <hr className="mt-1 mb-2" />
            <div
              className={`${spacing === "compact" ? "space-y-3" : spacing === "relaxed" ? "space-y-6" : "space-y-4"}`}
            >
              {formData.experiences.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <p className="font-bold">
                      {exp.title}, {exp.company}
                    </p>
                    <p>{exp.duration}</p>
                  </div>
                  <p className="mt-1 whitespace-pre-line">{exp.achievements}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {formData.technicalSkills && formData.technicalSkills.length > 0 && (
            <div>
              <h2 className="text-lg font-bold" style={{ color }}>
                TECHNICAL SKILLS
              </h2>
              <hr className="mt-1 mb-2" />
              <ul className="list-disc pl-5">
                {formData.technicalSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          )}

          {formData.softSkills && formData.softSkills.length > 0 && (
            <div>
              <h2 className="text-lg font-bold" style={{ color }}>
                SOFT SKILLS
              </h2>
              <hr className="mt-1 mb-2" />
              <ul className="list-disc pl-5">
                {formData.softSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render selected template
  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate />;
      case "professional":
        return <ProfessionalTemplate />;
      case "creative":
        return <CreativeTemplate />;
      case "minimal":
        return <MinimalTemplate />;
      default:
        return <ModernTemplate />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Left side - Editor */}
      <div className="w-1/2 h-full p-6 overflow-y-auto bg-gray-700">
        <Editor />
      </div>

      {/* Right side - Preview */}
      <div className="w-1/2 h-full p-6 flex flex-col bg-gray-800">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-medium text-white">Resume Preview</h2>
          <button
            onClick={downloadResume}
            disabled={isDownloading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            <Download size={16} className="mr-2" />
            {isDownloading ? "Generating PDF..." : "Download PDF"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto border shadow-md rounded-md">
          <div
            ref={resumeRef}
            className="w-full p-6"
            style={{ backgroundColor: "#1a202c" }}
          >
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateResume;
