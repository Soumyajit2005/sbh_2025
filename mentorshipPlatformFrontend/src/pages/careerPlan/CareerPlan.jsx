import { useState, useRef } from "react";
import {
  Upload,
  File,
  Cpu,
  User,
  Briefcase,
  BookOpen,
  ChevronRight,
  FileText,
  Clock,
  CheckCircle,
  Award,
  TrendingUp,
  BookOpen as BookOpenIcon,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CareerPlan() {
  const [apiCareerRecommendation, setApiCareerRecommendation] = useState(null);
  const [selectedCareerPath, setSelectedCareerPath] = useState(null);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [careerRecommendation, setCareerRecommendation] = useState(null);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const softwareDeveloperCareerPath = {
    id: "software-developer-path",
    title: "Software Development",
    summary:
      "Based on your skills and experience, software development is an excellent career choice.",
    description:
      "Software development offers a dynamic career with opportunities in various industries. Your technical background and problem-solving skills align well with this career path, allowing you to build innovative applications and solutions.",
    matchPercentage: 92,
    skills: {
      technical: [
        {
          name: "JavaScript",
          proficiency: "Advanced",
          icon: <CheckCircle className="w-4 h-4" />,
        },
        {
          name: "React.js",
          proficiency: "Intermediate",
          icon: <CheckCircle className="w-4 h-4" />,
        },
        {
          name: "Node.js",
          proficiency: "Intermediate",
          icon: <CheckCircle className="w-4 h-4" />,
        },
        {
          name: "HTML/CSS",
          proficiency: "Advanced",
          icon: <CheckCircle className="w-4 h-4" />,
        },
        {
          name: "Git",
          proficiency: "Intermediate",
          icon: <CheckCircle className="w-4 h-4" />,
        },
        {
          name: "Python",
          proficiency: "Beginner",
          icon: <CheckCircle className="w-4 h-4" />,
        },
      ],
      soft: [
        "Problem-solving",
        "Communication",
        "Team collaboration",
        "Time management",
        "Adaptability",
      ],
      developmentAreas: [
        "Cloud Services",
        "System Design",
        "Mobile Development",
        "DevOps",
        "UI/UX Design",
      ],
    },
    phases: [
      {
        number: "1",
        title: "Foundation",
        content:
          "• Learn core programming concepts and languages (JavaScript, HTML, CSS)\n• Build simple web applications with vanilla JavaScript\n• Master Git version control and GitHub workflows\n• Develop understanding of data structures and algorithms\n• Create a portfolio with basic projects",
      },
      {
        number: "2",
        title: "Frontend Specialization",
        content:
          "• Master React.js framework for building interactive UIs\n• Learn state management with Redux or Context API\n• Study responsive design and CSS frameworks (Tailwind, Bootstrap)\n• Implement user authentication and API integration\n• Build complex frontend applications with modern practices",
      },
      {
        number: "3",
        title: "Backend Development",
        content:
          "• Learn Node.js and Express for server-side development\n• Master database concepts with MongoDB and SQL databases\n• Implement RESTful APIs and understand GraphQL\n• Study server deployment and cloud services (AWS, Azure)\n• Build full-stack applications with proper architecture",
      },
      {
        number: "4",
        title: "Advanced Skills & Specialization",
        content:
          "• Learn DevOps practices and CI/CD pipelines\n• Study system design and architecture patterns\n• Explore specialized areas (mobile dev, AI/ML integration)\n• Master testing strategies and performance optimization\n• Develop leadership and project management skills",
      },
    ],
    marketInsights: {
      demand: "High demand based on your skills profile",
      averageSalary: "$90,000 - $140,000 depending on location and experience",
      topIndustries: [
        "Technology",
        "E-commerce",
        "Financial Services",
        "Healthcare",
        "Education",
      ],
    },
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    // Only accept PDF or DOCX files
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setFile(file);
      setError(null);
    } else {
      setError("Please upload a PDF or DOCX file");
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const simulateProgress = () => {
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 95) {
          clearInterval(interval);
          return 95;
        }
        return newProgress;
      });
    }, 700);

    return () => clearInterval(interval);
  };

  const handleAnalyzeResume = async () => {
    setIsAnalyzing(true);
    setError(null);
    setUploadProgress(0);

    // Start progress simulation
    const clearProgressSimulation = simulateProgress();

    try {
      // Create form data to send the file
      const formData = new FormData();

      if (!file) {
        setError("No file selected. Please upload a file before analyzing.");
        setIsAnalyzing(false);
        clearProgressSimulation();
        return;
      }

      formData.append("file", file);

      // Make API call to the backend
      const response = await fetch("http://localhost:8000/career-recommend/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Server error occurred";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Complete the progress bar
      setUploadProgress(100);

      if (!data || !data.career_path) {
        throw new Error("Invalid response data from server");
      }

      // Process the received data
      const parsedCareerPath = processCareerRecommendation(data.career_path);

      // Store the API career recommendation
      setApiCareerRecommendation(parsedCareerPath);

      // Set both options available but don't select any yet
      setAnalysisComplete(true);
      setSelectedCareerPath(null); // Clear any previous selection
    } catch (err) {
      console.error("Error analyzing resume:", err);
      setError(
        `Failed to analyze resume: ${err.message || "Please try again later."}`
      );
    } finally {
      setIsAnalyzing(false);
      clearProgressSimulation();
    }
  };

  const handleCareerPathSelect = (careerPath) => {
    setSelectedCareerPath(careerPath);
  };

  // Function to process the career recommendation text into a structured format
  const processCareerRecommendation = (careerPathText) => {
    // Improved regex to extract career title from the text
    const titleMatch = careerPathText.match(
      /career path in \*\*([^*]+?)\*\*|career in \*\*([^*]+?)\*\*|career path in ([^,\.]+)|strong career path in ([^,\.]+)|focusing on ([^,\.]+)/i
    );

    // Extract the matched group that contains the career title
    let careerTitle = "Software Development"; // Default fallback
    if (titleMatch) {
      // Find the first non-undefined group after the full match
      for (let i = 1; i < titleMatch.length; i++) {
        if (titleMatch[i]) {
          // Remove any remaining asterisks and trim whitespace
          careerTitle = titleMatch[i].replace(/\*/g, "").trim();
          break;
        }
      }
    }

    // Extract specific career focus if mentioned
    const focusMatch = careerPathText.match(
      /specifically focusing on ([^,\.]+)/i
    );
    if (focusMatch && focusMatch[1]) {
      careerTitle = focusMatch[1].replace(/\*/g, "").trim();
    }

    // Split the text into sections more effectively
    const phases = extractPhases(careerPathText);

    return {
      id: `career-path-${Date.now()}`,
      title: careerTitle,
      summary: extractSummary(careerPathText),
      description: extractDescription(careerPathText),
      matchPercentage: calculateMatchPercentage(careerPathText),
      skills: {
        technical: extractTechnicalSkills(careerPathText, careerTitle),
        soft: extractSoftSkills(careerPathText),
        developmentAreas: extractDevelopmentAreas(careerPathText),
      },
      phases: phases,
      marketInsights: {
        demand:
          extractDemandInfo(careerPathText) ||
          "High demand based on your skills profile",
        averageSalary:
          extractSalaryInfo(careerPathText) ||
          "$95,000 - $135,000 depending on location and experience",
        topIndustries: extractTopIndustries(careerPathText) || [
          "Technology",
          "E-commerce",
          "Financial Services",
          "Healthcare",
        ],
      },
      rawContent: careerPathText,
    };
  };

  const extractPhases = (text) => {
    const phaseRegex =
      /\*?\*?Phase\s+(\d+)[:\s]*([^:*\n]+?)[:*\s]*\n+([\s\S]+?)(?=\*?\*?Phase\s+\d+|Higher Studies:|$)/gi;
    const phases = [];

    let match;
    while ((match = phaseRegex.exec(text)) !== null) {
      phases.push({
        number: match[1],
        title: match[2].trim(),
        content: match[3].trim().replace(/\*\s+/g, "• "), // Convert asterisks to bullet points
      });
    }

    // If no phases found, create a fallback structure
    if (phases.length === 0) {
      // Try to extract content sections
      const sections = text.split(/\n\n/);
      if (sections.length >= 4) {
        // Create phases based on general sections
        return [
          {
            number: "1",
            title: "Foundation",
            content: sections[1] || "Build your foundational skills.",
          },
          {
            number: "2",
            title: "Entry-Level",
            content: sections[2] || "Focus on entry-level positions.",
          },
          {
            number: "3",
            title: "Specialization",
            content: sections[3] || "Specialize in your chosen path.",
          },
          {
            number: "4",
            title: "Advanced Growth",
            content: sections[4] || "Advance to leadership positions.",
          },
        ];
      }
    }

    return phases;
  };

  // Helper functions for extracting information from career path text
  const extractSummary = (text) => {
    const firstParagraph = text.split("\n\n")[0];
    return firstParagraph.replace(/\*\*/g, "");
  };

  const extractDescription = (text) => {
    const paragraphs = text.split("\n\n");
    return paragraphs.length > 1
      ? paragraphs.slice(1, 3).join("\n\n").replace(/\*\*/g, "")
      : "";
  };

  const calculateMatchPercentage = (text) => {
    // Look for percentage in text or generate based on keywords
    const percentageMatch = text.match(/(\d{2,3})%\s+match/i);
    if (percentageMatch) return parseInt(percentageMatch[1]);

    // Count positive keywords to estimate match
    const positiveKeywords = [
      "perfect",
      "excellent",
      "ideal",
      "strong",
      "great",
    ];
    let count = 0;
    positiveKeywords.forEach((keyword) => {
      const regex = new RegExp(keyword, "gi");
      const matches = text.match(regex);
      if (matches) count += matches.length;
    });

    // Generate a percentage between 75 and 95
    return Math.min(75 + count * 5, 95);
  };

  const extractTechnicalSkills = (text, careerTitle) => {
    // Add career-specific skills based on the title
    let careerSkills = [];

    if (
      careerTitle.includes("Full-Stack") ||
      careerTitle.includes("Web Development")
    ) {
      careerSkills = [
        "JavaScript",
        "React.js",
        "Node.js",
        "HTML",
        "CSS",
        "MongoDB",
        "Express.js",
      ];
    } else if (
      careerTitle.includes("Machine Learning") ||
      careerTitle.includes("Data Science")
    ) {
      careerSkills = [
        "Python",
        "TensorFlow",
        "PyTorch",
        "scikit-learn",
        "SQL",
        "Data Visualization",
      ];
    } else if (careerTitle.includes("Software Engineer")) {
      careerSkills = [
        "Java",
        "Python",
        "JavaScript",
        "Data Structures",
        "Algorithms",
        "Git",
      ];
    }

    // Extract skills mentioned in the text
    const skillsFromText = [];
    const commonSkills = [
      "JavaScript",
      "Python",
      "Java",
      "C#",
      "C++",
      "TypeScript",
      "React",
      "React.js",
      "Angular",
      "Vue.js",
      "Node.js",
      "Express",
      "Django",
      "SQL",
      "MongoDB",
      "NoSQL",
      "AWS",
      "Azure",
      "Docker",
      "Kubernetes",
      "HTML",
      "CSS",
      "Git",
      "TensorFlow",
      "PyTorch",
      "Machine Learning",
      "Data Science",
      "Deep Learning",
      "NLP",
    ];

    commonSkills.forEach((skill) => {
      if (text.includes(skill)) {
        skillsFromText.push({
          name: skill,
          proficiency: getProficiencyLevel(text, skill),
          // Use an actual JSX element instead of a string
          icon: <CheckCircle className="w-4 h-4" />,
        });
      }
    });

    // Combine skills from text and career-specific skills
    const combinedSkills = [...skillsFromText];

    // Add career skills that weren't found in the text
    careerSkills.forEach((skill) => {
      if (!combinedSkills.some((s) => s.name === skill)) {
        combinedSkills.push({
          name: skill,
          proficiency: "Intermediate",
          // Use an actual JSX element instead of a string
          icon: <CheckCircle className="w-4 h-4" />,
        });
      }
    });

    // Ensure we have enough skills
    if (combinedSkills.length < 5) {
      const defaultSkills = ["JavaScript", "HTML", "CSS", "Git", "React.js"];
      defaultSkills.forEach((skill) => {
        if (!combinedSkills.some((s) => s.name === skill)) {
          combinedSkills.push({
            name: skill,
            proficiency: "Intermediate",
            // Use an actual JSX element instead of a string
            icon: <CheckCircle className="w-4 h-4" />,
          });
        }
      });
    }

    return combinedSkills;
  };

  const getProficiencyLevel = (text, skill) => {
    const proficiencyTerms = {
      advanced: ["expert", "advanced", "extensive", "proficient"],
      intermediate: ["intermediate", "moderate", "competent"],
      beginner: ["beginner", "basic", "learning", "novice"],
    };

    // Look for proficiency terms near the skill
    const skillContext = text.substring(
      Math.max(0, text.indexOf(skill) - 50),
      Math.min(text.length, text.indexOf(skill) + 50)
    );

    for (const [level, terms] of Object.entries(proficiencyTerms)) {
      for (const term of terms) {
        if (skillContext.toLowerCase().includes(term)) {
          return level.charAt(0).toUpperCase() + level.slice(1);
        }
      }
    }

    return Math.random() > 0.5 ? "Advanced" : "Intermediate";
  };

  const extractSoftSkills = (text) => {
    const commonSoftSkills = [
      "Problem-solving",
      "Communication",
      "Team collaboration",
      "Leadership",
      "Time management",
      "Adaptability",
      "Critical thinking",
      "Creativity",
      "Emotional intelligence",
      "Project management",
      "Negotiation",
      "Conflict resolution",
      "Continuous learning",
      "Attention to detail",
    ];

    const foundSkills = [];

    commonSoftSkills.forEach((skill) => {
      if (text.toLowerCase().includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });

    // Return at least 5 soft skills
    return foundSkills.length >= 5
      ? foundSkills.slice(0, 8)
      : [...foundSkills, ...commonSoftSkills.slice(0, 5 - foundSkills.length)];
  };

  const extractDevelopmentAreas = (text) => {
    const developmentKeywords = [
      "improve",
      "develop",
      "enhance",
      "learn",
      "strengthen",
      "focus on",
      "build",
      "expand",
      "grow",
    ];

    const skillsToLookFor = [
      "Machine Learning",
      "Data Science",
      "Cloud Computing",
      "Cybersecurity",
      "DevOps",
      "Mobile Development",
      "UI/UX Design",
      "Big Data",
      "Blockchain",
      "AR/VR",
      "CI/CD",
      "System Design",
      "Microservices",
      "Leadership",
      "Project Management",
    ];

    const foundAreas = [];

    // Look for skills mentioned near development keywords
    developmentKeywords.forEach((keyword) => {
      const keywordPositions = [];
      let position = text.toLowerCase().indexOf(keyword.toLowerCase());

      while (position !== -1) {
        keywordPositions.push(position);
        position = text
          .toLowerCase()
          .indexOf(keyword.toLowerCase(), position + 1);
      }

      keywordPositions.forEach((pos) => {
        const context = text.substring(pos, pos + 100);

        skillsToLookFor.forEach((skill) => {
          if (context.includes(skill) && !foundAreas.includes(skill)) {
            foundAreas.push(skill);
          }
        });
      });
    });

    // Also add skills that come after phrases like "need to develop" or "should learn"
    const developmentPhrases = [
      "need to develop",
      "should learn",
      "recommend focusing on",
      "suggest learning",
      "would benefit from",
    ];

    developmentPhrases.forEach((phrase) => {
      const phrasePositions = [];
      let position = text.toLowerCase().indexOf(phrase.toLowerCase());

      while (position !== -1) {
        phrasePositions.push(position);
        position = text
          .toLowerCase()
          .indexOf(phrase.toLowerCase(), position + 1);
      }

      phrasePositions.forEach((pos) => {
        const context = text.substring(pos, pos + 100);

        skillsToLookFor.forEach((skill) => {
          if (context.includes(skill) && !foundAreas.includes(skill)) {
            foundAreas.push(skill);
          }
        });
      });
    });

    // Return at least 3 development areas
    return foundAreas.length >= 3
      ? foundAreas.slice(0, 5)
      : [
          ...foundAreas,
          ...["Cloud Services", "Advanced Algorithms", "System Design"].slice(
            0,
            3 - foundAreas.length
          ),
        ];
  };

  const extractSectionContent = (text, sectionName) => {
    const sectionRegex = new RegExp(
      `\\*\\*Phase \\d+: ${sectionName}.*?\\*\\*(.*?)(?=\\*\\*Phase|\\*\\*|$)`,
      "s"
    );
    const match = text.match(sectionRegex);
    return match
      ? match[1].trim()
      : `Information about ${sectionName} phase will be generated based on your skills and experience.`;
  };

  const extractSalaryInfo = (text) => {
    const salaryRegex = /\$\d{2,3}(,\d{3})?(\s*-\s*\$\d{2,3}(,\d{3})?)?/g;
    const match = text.match(salaryRegex);
    return match ? match[0] : null;
  };

  const extractDemandInfo = (text) => {
    const demandPhrases = [
      {
        regex: /high demand/i,
        result: "High demand based on your skills profile",
      },
      {
        regex: /growing demand/i,
        result: "Growing demand in the current market",
      },
      {
        regex: /very competitive/i,
        result: "Very competitive field with significant demand",
      },
      {
        regex: /moderate demand/i,
        result: "Moderate demand with good opportunities",
      },
      {
        regex: /exceptional demand/i,
        result: "Exceptional demand in today's market",
      },
    ];

    for (const { regex, result } of demandPhrases) {
      if (regex.test(text)) {
        return result;
      }
    }

    return null;
  };

  const extractTopIndustries = (text) => {
    const commonIndustries = [
      "Technology",
      "Healthcare",
      "Financial Services",
      "E-commerce",
      "Education",
      "Manufacturing",
      "Entertainment",
      "Retail",
      "Government",
      "Automotive",
      "Telecommunications",
      "Energy",
    ];

    const foundIndustries = [];

    commonIndustries.forEach((industry) => {
      if (text.includes(industry)) {
        foundIndustries.push(industry);
      }
    });

    return foundIndustries.length >= 3 ? foundIndustries.slice(0, 5) : null;
  };

  const handleNavigateToRoadmap = () => {
    // Ensure we have a selected career path
    if (!selectedCareerPath) {
      setError("Please select a career path first");
      return;
    }

    // Generate roadmap data
    let roadmapData;

    if (selectedCareerPath.id === "software-developer-path") {
      // Use hardcoded roadmap data for software developer
      roadmapData = {
        careerPath: "Software Development",
        learningPath: [
          {
            phase: "1",
            title: "Foundation",
            technologiesToLearn: [
              "JavaScript",
              "HTML",
              "CSS",
              "Git",
              "Data Structures",
            ],
          },
          {
            phase: "2",
            title: "Frontend Specialization",
            technologiesToLearn: [
              "React.js",
              "Redux",
              "Tailwind CSS",
              "TypeScript",
              "Jest",
            ],
          },
          {
            phase: "3",
            title: "Backend Development",
            technologiesToLearn: [
              "Node.js",
              "Express",
              "MongoDB",
              "PostgreSQL",
              "RESTful APIs",
            ],
          },
          {
            phase: "4",
            title: "Advanced Skills",
            technologiesToLearn: [
              "Docker",
              "AWS",
              "CI/CD",
              "System Design",
              "GraphQL",
            ],
          },
        ],
        coreTechnicalSkills: [
          "JavaScript",
          "React.js",
          "Node.js",
          "HTML/CSS",
          "Git",
          "MongoDB",
        ],
        developmentAreas: [
          "Cloud Services",
          "System Design",
          "DevOps",
          "Mobile Development",
          "UI/UX Design",
        ],
        generatedAt: new Date().toISOString(),
      };
    } else {
      // Extract the data for API-based career path like in the original code
      const extractTechSkills = (phaseContent) => {
        const skillsToLearn = [];

        // List of technical keywords to look for
        const techKeywords = [
          "JavaScript",
          "Python",
          "Java",
          "C#",
          "C++",
          "TypeScript",
          "Go",
          "Ruby",
          "PHP",
          "Swift",
          "Kotlin",
          "React",
          "Angular",
          "Vue",
          "Node.js",
          "Express",
          "Django",
          "Flask",
          "Spring Boot",
          "SQL",
          "MongoDB",
          "PostgreSQL",
          "MySQL",
          "Redis",
          "Firebase",
          "Cassandra",
          "DynamoDB",
          "AWS",
          "Azure",
          "GCP",
          "Docker",
          "Kubernetes",
          "Jenkins",
          "Git",
          "GitHub",
          "GitLab",
          "TensorFlow",
          "PyTorch",
          "scikit-learn",
          "Pandas",
          "NumPy",
          "R",
          "Tableau",
          "Power BI",
          "REST API",
          "GraphQL",
          "WebSockets",
          "gRPC",
          "Microservices",
          "Serverless",
          "CI/CD",
          "HTML",
          "CSS",
          "SASS",
          "LESS",
          "Bootstrap",
          "Tailwind CSS",
          "Material UI",
          "Redux",
          "Next.js",
          "Gatsby",
          "Flutter",
          "React Native",
          "Electron",
          "Unity",
        ];

        // Find technical skills in bullet points
        const bulletMatches = phaseContent.match(/[•\*]\s*([^\n]+)/g) || [];
        bulletMatches.forEach((match) => {
          const content = match.replace(/[•\*]\s*/, "").trim();
          techKeywords.forEach((keyword) => {
            if (content.includes(keyword) && !skillsToLearn.includes(keyword)) {
              skillsToLearn.push(keyword);
            }
          });
        });

        // Look for skills in the entire phase content if not enough found in bullets
        if (skillsToLearn.length < 3) {
          techKeywords.forEach((keyword) => {
            if (
              phaseContent.includes(keyword) &&
              !skillsToLearn.includes(keyword)
            ) {
              skillsToLearn.push(keyword);
            }
          });
        }

        return skillsToLearn;
      };

      roadmapData = {
        careerPath: selectedCareerPath.title,
        learningPath: selectedCareerPath.phases.map((phase) => ({
          phase: phase.number,
          title: phase.title,
          technologiesToLearn: extractTechSkills(phase.content),
        })),
        coreTechnicalSkills: selectedCareerPath.skills.technical
          .map((skill) => skill.name)
          .filter((name) => {
            // Filter to keep only programming languages, frameworks, tools, etc.
            const generalSkills = [
              "Problem Solving",
              "Data Structures",
              "Algorithms",
              "Design Patterns",
            ];
            return !generalSkills.includes(name);
          }),
        developmentAreas: selectedCareerPath.skills.developmentAreas.filter(
          (area) => {
            // Keep only specific technologies, not general concepts
            const generalAreas = ["Leadership", "Communication", "Team Work"];
            return !generalAreas.includes(area);
          }
        ),
        generatedAt: new Date().toISOString(),
      };
    }

    // Navigate to roadmap page with the data
    navigate(`/dashboard/roadmap`, {
      state: { roadmapData },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-900 rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
        <span className="mr-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-md p-1">
          <User className="w-6 h-6" />
        </span>
        Career Path Analyzer
      </h1>
      <p className="text-gray-400 mb-8">
        Upload your resume to discover your ideal career path with a
        personalized roadmap
      </p>

      {error && (
        <div className="bg-red-900/30 border border-red-600/30 text-red-400 p-4 rounded-lg mb-6 flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!file && !analysisComplete && (
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors duration-300 ${
            isDragging
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-700 hover:border-gray-500"
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <div
              className={`p-4 rounded-full bg-gray-800 mb-4 transition-colors duration-300 ${isDragging ? "text-blue-400" : "text-gray-400"}`}
            >
              <Upload className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              Drag & Drop Your Resume
            </h3>
            <p className="text-gray-400 mb-6">
              Upload your resume as a PDF or DOCX file
            </p>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileInputChange}
              ref={fileInputRef}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
            >
              Browse Files
            </button>
          </div>
        </div>
      )}

      {file && !isAnalyzing && !analysisComplete && (
        <div className="border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400 mr-4">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-medium text-white">{file.name}</h3>
              <p className="text-sm text-gray-400">
                {(file.size / (1024 * 1024)).toFixed(2)} MB •{" "}
                {file.type.includes("pdf") ? "PDF" : "DOCX"}
              </p>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Remove
            </button>
          </div>

          <button
            onClick={handleAnalyzeResume}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/20 flex items-center justify-center"
          >
            <Cpu className="w-5 h-5 mr-2" />
            Analyze Resume
          </button>
        </div>
      )}

      {isAnalyzing && (
        <div className="border border-gray-700 rounded-xl p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin mb-4"></div>
              <Cpu className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              Analyzing Your Resume
            </h3>
            <p className="text-gray-400">
              Our AI is analyzing your skills and experience to find the perfect
              career match
            </p>

            <div className="w-full max-w-md mt-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">
                  {uploadProgress < 25 && "Extracting resume data..."}
                  {uploadProgress >= 25 &&
                    uploadProgress < 50 &&
                    "Analyzing skills and experience..."}
                  {uploadProgress >= 50 &&
                    uploadProgress < 75 &&
                    "Matching with career paths..."}
                  {uploadProgress >= 75 &&
                    "Generating personalized recommendations..."}
                </span>
                <span className="text-sm text-blue-400">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {analysisComplete && (
        <div className="space-y-6">
          <div className="p-6 border border-green-600 rounded-xl bg-green-900/20 mb-8">
            <div className="flex items-start">
              <div className="p-2 rounded-lg bg-green-500/20 text-green-400 mr-4 flex-shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-white mb-1">
                  Career Matches Found!
                </h3>
                <p className="text-gray-300">
                  Based on your skills and experience, we've identified
                  potential career paths. Select one to view details and
                  generate a learning roadmap.
                </p>
              </div>
            </div>
          </div>

          {/* Career Path Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* API Recommended Career Path */}
            {apiCareerRecommendation && (
              <div
                className={`border rounded-xl p-6 transition-all duration-300 cursor-pointer
                     ${
                       selectedCareerPath?.id === apiCareerRecommendation.id
                         ? "border-blue-600 bg-blue-900/20"
                         : "border-gray-700 hover:border-blue-600/50 bg-gray-800/50"
                     }`}
                onClick={() => handleCareerPathSelect(apiCareerRecommendation)}
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400 mr-4">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white">
                      {apiCareerRecommendation.title}
                    </h3>
                  </div>
                  <div className="ml-auto">
                    <div className="px-3 py-1 bg-blue-500/20 rounded-full">
                      <span className="text-blue-300 font-medium">
                        {apiCareerRecommendation.matchPercentage}% Match
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 mb-4 line-clamp-2">
                  {apiCareerRecommendation.summary}
                </p>

                <div className="flex flex-wrap gap-2">
                  {apiCareerRecommendation.skills.technical
                    .slice(0, 4)
                    .map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                      >
                        {skill.name}
                      </span>
                    ))}
                  {apiCareerRecommendation.skills.technical.length > 4 && (
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                      +{apiCareerRecommendation.skills.technical.length - 4}{" "}
                      more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Software Developer Career Path (Hardcoded) */}
            <div
              className={`border rounded-xl p-6 transition-all duration-300 cursor-pointer
                   ${
                     selectedCareerPath?.id === "software-developer-path"
                       ? "border-blue-600 bg-blue-900/20"
                       : "border-gray-700 hover:border-blue-600/50 bg-gray-800/50"
                   }`}
              onClick={() =>
                handleCareerPathSelect(softwareDeveloperCareerPath)
              }
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400 mr-4">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">
                    Software Development
                  </h3>
                </div>
                <div className="ml-auto">
                  <div className="px-3 py-1 bg-purple-500/20 rounded-full">
                    <span className="text-purple-300 font-medium">
                      92% Match
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-4 line-clamp-2">
                Based on your skills and experience, software development is an
                excellent career choice.
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                  JavaScript
                </span>
                <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                  React.js
                </span>
                <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                  Node.js
                </span>
                <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                  HTML/CSS
                </span>
                <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                  +2 more
                </span>
              </div>
            </div>
          </div>

          {/* Selected Career Path Details */}
          {selectedCareerPath && (
            <div className="border border-blue-600/30 rounded-xl overflow-hidden transition-all duration-500 bg-gray-800/50">
              <div className="bg-blue-900/20 border-b border-blue-600/30 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400 mr-4">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-white">
                      {selectedCareerPath.title}
                    </h2>
                    <p className="text-blue-300">
                      {selectedCareerPath.summary}
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-blue-500/20 rounded-full flex items-center">
                    <span className="text-blue-300 text-lg font-bold mr-1">
                      {selectedCareerPath.matchPercentage}%
                    </span>
                    <span className="text-blue-400 text-sm">Match</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white mb-3">
                    Summary
                  </h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {selectedCareerPath.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      Technical Skills Assessment
                    </h3>
                    <div className="space-y-3">
                      {selectedCareerPath.skills.technical.map(
                        (skill, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <span className="text-green-400 mr-2">
                                {skill.icon}
                              </span>
                              <span className="text-gray-300">
                                {skill.name}
                              </span>
                            </div>
                            <span
                              className={`text-sm ${
                                skill.proficiency === "Advanced"
                                  ? "text-green-400"
                                  : skill.proficiency === "Intermediate"
                                    ? "text-blue-400"
                                    : "text-yellow-400"
                              }`}
                            >
                              {skill.proficiency}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <User className="w-5 h-5 text-blue-400 mr-2" />
                      Soft Skills
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedCareerPath.skills.soft.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 text-purple-400 mr-2" />
                      Development Areas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCareerPath.skills.developmentAreas.map(
                        (skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Career Roadmap
                  </h3>
                  <div className="space-y-4">
                    {selectedCareerPath.phases.map((phase, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded-lg">
                        <h4 className="text-blue-300 mb-2 font-medium">
                          Phase {phase.number}: {phase.title}
                        </h4>
                        <p className="text-gray-300 whitespace-pre-line">
                          {phase.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Market Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h4 className="text-gray-400 text-sm uppercase mb-2">
                        Demand
                      </h4>
                      <p className="text-green-400 font-medium">
                        {selectedCareerPath.marketInsights.demand}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h4 className="text-gray-400 text-sm uppercase mb-2">
                        Average Salary
                      </h4>
                      <p className="text-green-400 font-medium">
                        {selectedCareerPath.marketInsights.averageSalary}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h4 className="text-gray-400 text-sm uppercase mb-2">
                        Top Industries
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedCareerPath.marketInsights.topIndustries.map(
                          (industry, index) => (
                            <span key={index} className="text-blue-300 text-sm">
                              {industry}
                              {index <
                              selectedCareerPath.marketInsights.topIndustries
                                .length -
                                1
                                ? ", "
                                : ""}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleNavigateToRoadmap}
                    className="flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/20 text-lg"
                  >
                    <BookOpenIcon className="w-6 h-6 mr-2" />
                    <span>Generate Learning Roadmap</span>
                    <ChevronRight className="w-6 h-6 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
