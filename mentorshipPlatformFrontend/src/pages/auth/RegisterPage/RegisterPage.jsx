import { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, X, Loader, ChevronDown } from 'lucide-react';

export default function RegistrationPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState(null); // 'success', 'error', or null
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    dob: "",
    contactEmail: "",
    phone: "",
    location: "",
    preferredLanguages: "",
    educationLevel: "",
    institutionName: "",
    major: "",
    graduationDate: "",
    gpa: "",
    achievements: "",
    coursework: "",
    academicCertifications: "",
    careerInterests: "",
    industrySectors: "",
    shortTermGoals: "",
    longTermGoals: "",
    dreamJob: "",
    programmingLanguages: "",
    softwareSkills: "",
    techCertifications: "",
    skillLevels: "",
    softSkills: "",
    workExperience: "",
    linkedin: "",
    github: "",
    otherSocial: "",
    website: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus('success');
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formSections = [
    {
      title: "Account Information",
      fields: [
        { name: "email", label: "Email", type: "email", required: true },
        { name: "password", label: "Password", type: "password", required: true },
        { name: "fullName", label: "Full Name", type: "text", required: true }
      ]
    },
    {
      title: "Personal Details",
      fields: [
        { name: "dob", label: "Date of Birth", type: "date" },
        { name: "contactEmail", label: "Contact Email", type: "email" },
        { name: "phone", label: "Phone Number", type: "tel" },
        { 
          name: "location", 
          label: "Location", 
          type: "select",
          options: [
            "New York", "San Francisco", "Los Angeles", "Chicago", 
            "Seattle", "Austin", "Boston", "Denver", "Miami", 
            "London", "Toronto", "Berlin", "Tokyo", "Other"
          ]
        },
        { 
          name: "preferredLanguages", 
          label: "Preferred Languages", 
          type: "select", 
          options: ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Other"]
        }
      ]
    },
    {
      title: "Education",
      fields: [
        { 
          name: "educationLevel", 
          label: "Education Level", 
          type: "select",
          options: [
            "High School", "Associate's Degree", "Bachelor's Degree", 
            "Master's Degree", "Ph.D.", "Professional Degree", "Other"
          ]
        },
        { name: "institutionName", label: "Institution Name", type: "text" },
        { 
          name: "major", 
          label: "Major/Field of Study", 
          type: "select",
          options: [
            "Computer Science", "Information Technology", "Software Engineering",
            "Data Science", "Cybersecurity", "Business", "Mathematics",
            "Physics", "Engineering", "Other"
          ]
        },
        { name: "graduationDate", label: "Graduation Date", type: "date" },
        { name: "gpa", label: "GPA", type: "number", step: "0.1" },
        { name: "achievements", label: "Achievements", type: "text" },
        { name: "coursework", label: "Relevant Coursework", type: "text" },
        { name: "academicCertifications", label: "Academic Certifications", type: "text" }
      ]
    },
    {
      title: "Career Goals",
      fields: [
        { 
          name: "careerInterests", 
          label: "Career Interests", 
          type: "select",
          options: [
            "Software Development", "Data Science", "Machine Learning", 
            "Web Development", "Mobile Development", "DevOps", 
            "Cloud Computing", "Cybersecurity", "Product Management", "Other"
          ]
        },
        { 
          name: "industrySectors", 
          label: "Industry Sectors", 
          type: "select",
          options: [
            "Technology", "Finance", "Healthcare", "Education", 
            "E-commerce", "Entertainment", "Government", "Consulting", "Other"
          ]
        },
        { name: "shortTermGoals", label: "Short-term Goals", type: "text" },
        { name: "longTermGoals", label: "Long-term Goals", type: "text" },
        { 
          name: "dreamJob", 
          label: "Dream Job", 
          type: "select",
          options: [
            "Software Engineer", "Full Stack Developer", "Data Scientist",
            "Machine Learning Engineer", "DevOps Engineer", "CTO",
            "Product Manager", "Tech Lead", "Entrepreneur", "Other"
          ]
        }
      ]
    },
    {
      title: "Skills & Experience",
      fields: [
        { 
          name: "programmingLanguages", 
          label: "Programming Languages", 
          type: "select",
          options: [
            "JavaScript", "Python", "Java", "C++", "C#", 
            "TypeScript", "Go", "Ruby", "PHP", "Swift", "Other"
          ]
        },
        { 
          name: "softwareSkills", 
          label: "Software Skills", 
          type: "select",
          options: [
            "VSCode", "Git", "Docker", "AWS", "Azure", 
            "Google Cloud", "React", "Angular", "Vue", "Node.js", "Other"
          ]
        },
        { name: "techCertifications", label: "Technical Certifications", type: "text" },
        { 
          name: "skillLevels", 
          label: "Skill Level", 
          type: "select",
          options: [
            "Beginner", "Intermediate", "Advanced", "Expert"
          ]
        },
        { 
          name: "softSkills", 
          label: "Soft Skills", 
          type: "select",
          options: [
            "Communication", "Leadership", "Teamwork", 
            "Problem Solving", "Time Management", "Critical Thinking", "Other"
          ]
        },
        { name: "workExperience", label: "Work Experience", type: "text" }
      ]
    },
    {
      title: "Social Media & Portfolio",
      fields: [
        { name: "linkedin", label: "LinkedIn URL", type: "url" },
        { name: "github", label: "GitHub URL", type: "url" },
        { name: "otherSocial", label: "Other Social Media", type: "url" },
        { name: "website", label: "Personal Website", type: "url" }
      ]
    }
  ];

  const nextSection = () => {
    if (currentSection < formSections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const isLastSection = currentSection === formSections.length - 1;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div 
        className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
        style={{
          opacity: 1,
          transform: 'translateY(0)',
          transition: 'opacity 0.5s ease, transform 0.5s ease'
        }}
      >
        {formStatus === 'success' ? (
          <div 
            className="p-8 text-center"
            style={{
              opacity: 1,
              transform: 'scale(1)',
              transition: 'opacity 0.5s ease, transform 0.5s ease'
            }}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-green-500 rounded-full p-4">
                <Check size={48} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-green-400 mb-4">Registration Successful!</h2>
            <p className="text-gray-300 text-lg mb-6">Your account has been created successfully.</p>
            <button 
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300"
              onClick={() => window.location.href = "/auth/login"}
            >
              Continue to Login
            </button>
          </div>
        ) : formStatus === 'error' ? (
          <div 
            className="p-8 text-center"
            style={{
              opacity: 1,
              transform: 'scale(1)',
              transition: 'opacity 0.5s ease, transform 0.5s ease'
            }}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-red-500 rounded-full p-4">
                <X size={48} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-red-400 mb-4">Registration Failed</h2>
            <p className="text-gray-300 text-lg mb-6">There was an error processing your registration. Please try again.</p>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300"
              onClick={() => setFormStatus(null)}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gray-700 px-8 py-6">
              <h1 className="text-3xl font-bold text-blue-400">Create Your Account</h1>
              <div className="mt-4 flex items-center">
                {formSections.map((section, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === currentSection ? "bg-blue-500" : 
                        index < currentSection ? "bg-green-500" : "bg-gray-600"
                      }`}
                    >
                      {index < currentSection ? (
                        <Check size={16} className="text-white" />
                      ) : (
                        <span className="text-white font-medium">{index + 1}</span>
                      )}
                    </div>
                    {index < formSections.length - 1 && (
                      <div className={`w-12 h-1 ${
                        index < currentSection ? "bg-green-500" : "bg-gray-600"
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="px-8 py-6">
              <div
                key={currentSection}
                style={{
                  opacity: 1,
                  transform: 'translateX(0)',
                  transition: 'opacity 0.3s ease, transform 0.3s ease'
                }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-blue-300">
                  {formSections[currentSection].title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formSections[currentSection].fields.map((field) => (
                    <div key={field.name} className="mb-4">
                      <label 
                        htmlFor={field.name} 
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {field.type === "select" ? (
                        <div className="relative">
                          <select
                            id={field.name}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            required={field.required}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          >
                            <option value="">Select {field.label}</option>
                            {field.options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      ) : (
                        <input
                          type={field.type}
                          id={field.name}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          required={field.required}
                          step={field.step || "any"}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={prevSection}
                  disabled={currentSection === 0}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    currentSection === 0 
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed" 
                      : "bg-gray-700 hover:bg-gray-600 text-gray-100"
                  }`}
                >
                  <ChevronLeft size={20} className="mr-2" />
                  Previous
                </button>

                {isLastSection ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-all duration-200 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader size={20} className="mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Complete Registration
                        <Check size={20} className="ml-2" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={nextSection}
                    className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-all duration-200"
                  >
                    Next
                    <ChevronRight size={20} className="ml-2" />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}