import { useState, useEffect } from 'react';
import { CheckCircle, Circle, ChevronDown, ChevronRight, Code, Server, Database, Cloud, Zap, FileCheck, BookOpen, Users, Award, Brain, Briefcase, Star, TrendingUp, GitBranch } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// Icon mapping function for different sections
const getIconForSection = (title) => {
  const iconMapping = {
    "Foundation": <BookOpen />,
    "Entry-Level Roles": <Briefcase />,
    "Career Advancement": <TrendingUp />,
    "Leadership and Expertise": <Award />,
    "Frontend Fundamentals": <Code />,
    "Frontend Frameworks": <Zap />,
    "Backend Development": <Server />,
    "DevOps & Deployment": <Cloud />,
    "Advanced Topics": <Database />,
    "Machine Learning": <Brain />,
    "Data Science": <GitBranch />,
    "Cloud Services": <Cloud />
  };
  
  return iconMapping[title] || <Star />;
};

// Fallback data structure if no roadmap data is passed
const fallbackRoadmapData = {
  title: "Fullstack Developer Roadmap",
  description: "A comprehensive guide to becoming a fullstack developer",
  sections: [
    {
      id: 1,
      title: "Frontend Fundamentals",
      description: "Master the essential frontend technologies",
      completed: false,
      expanded: true,
      testAvailable: true,
      subItems: [
        { id: 101, title: "HTML5 & Semantic Markup", description: "Learn structure and semantics", completed: false },
        { id: 102, title: "CSS3 & Responsive Design", description: "Style with CSS and media queries", completed: false },
        { id: 103, title: "JavaScript Basics", description: "Core concepts and DOM manipulation", completed: false },
        { id: 104, title: "Modern CSS Frameworks", description: "Bootstrap, Tailwind CSS, or similar", completed: false },
      ]
    },
    // Other sections would follow in the same pattern
  ]
};

export default function Roadmap() {
  const location = useLocation();
  const passedRoadmapData = location.state?.roadmapData;
  
  // State for the roadmap data
  const [roadmapData, setRoadmapData] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [activeTest, setActiveTest] = useState(null);
  
  useEffect(() => {
    // Process incoming data if available or use fallback
    if (passedRoadmapData) {
      // Transform the passed data to match our component's expected structure
      const transformedData = transformRoadmapData(passedRoadmapData);
      setRoadmapData(transformedData);
    } else {
      setRoadmapData(fallbackRoadmapData);
    }
    
    // Trigger animation after component mounts
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }, [passedRoadmapData]);

  console.log("Roadmap Data:", passedRoadmapData);
  
  // Transform the passed roadmap data to match our component's structure
  const transformRoadmapData = (data) => {
    // Create learning path sections
    const learningPathSections = data.learningPath.map((phase, index) => {
      return {
        id: index + 1,
        title: phase.title,
        description: `Phase ${phase.phase}: ${phase.title}`,
        completed: false,
        expanded: index === 0, // Expand first section by default
        testAvailable: true,
        icon: getIconForSection(phase.title.includes("Foundation") ? "Foundation" : 
               phase.title.includes("Entry") ? "Entry-Level Roles" : "Career Advancement"),
        subItems: generateLearningPathItems(phase, index)
      };
    });
    
    // Add development areas as additional sections
    const developmentSections = data.developmentAreas.map((area, idx) => {
      return {
        id: learningPathSections.length + idx + 1,
        title: area,
        description: `Development focus area: ${area}`,
        completed: false,
        expanded: false,
        testAvailable: true,
        icon: getIconForSection(area),
        subItems: generateDevAreaItems(area, data.coreTechnicalSkills)
      };
    });
    
    // Combine all sections
    const allSections = [...learningPathSections, ...developmentSections];
    
    // Create market insights data
    const marketInfo = {
      averageSalary: "$95,000 - $140,000",
      demand: "High and Growing",
      topIndustries: ["Tech", "Finance", "Healthcare"]
    };
    
    return {
      title: data.careerPath || "Career Roadmap",
      description: `Generated on ${new Date(data.generatedAt).toLocaleDateString()}`,
      marketInfo: marketInfo,
      sections: allSections
    };
  };
  
  // Generate learning path items
  const generateLearningPathItems = (phase, phaseIndex) => {
    let subItems = [];
    let idCounter = (phaseIndex + 1) * 100;
    
    // Add technologies to learn
    if (phase.technologiesToLearn && phase.technologiesToLearn.length) {
      phase.technologiesToLearn.forEach((tech, idx) => {
        subItems.push({
          id: idCounter++,
          title: tech,
          description: `Master ${tech} fundamentals`,
          completed: false
        });
      });
    }
    
    // Add phase-specific items
    if (phase.title.includes("Foundation")) {
      subItems.push(
        { id: idCounter++, title: "Build Portfolio Projects", description: "Create projects to showcase your skills", completed: false },
        { id: idCounter++, title: "Contribute to Open Source", description: "Start contributing to open-source projects", completed: false }
      );
    } else if (phase.title.includes("Entry")) {
      subItems.push(
        { id: idCounter++, title: "Junior Developer Position", description: "Apply for entry-level positions", completed: false },
        { id: idCounter++, title: "Freelance Projects", description: "Take on freelance work to build experience", completed: false }
      );
    } else if (phase.title.includes("Advancement")) {
      subItems.push(
        { id: idCounter++, title: "Mid-Level Developer", description: "Progress to more senior positions", completed: false },
        { id: idCounter++, title: "Specialization", description: "Focus on specialized technologies", completed: false },
        { id: idCounter++, title: "Technical Leadership", description: "Begin leading technical initiatives", completed: false }
      );
    }
    
    return subItems;
  };
  
  // Generate development area items based on core skills
  const generateDevAreaItems = (area, coreSkills) => {
    let subItems = [];
    let idCounter = 1000;  // Start with a high number to avoid ID conflicts
    
    // Customize based on the development area
    switch(area) {
      case "Machine Learning":
        subItems = [
          { id: idCounter++, title: "ML Fundamentals", description: "Learn core ML concepts and algorithms", completed: false },
          { id: idCounter++, title: "TensorFlow/PyTorch", description: "Master a ML framework", completed: false },
          { id: idCounter++, title: "Model Deployment", description: "Deploy ML models in production", completed: false },
          { id: idCounter++, title: "ML Ops", description: "Learn ML operations and pipelines", completed: false }
        ];
        break;
        
      case "Data Science":
        subItems = [
          { id: idCounter++, title: "Data Analysis", description: "Learn to analyze and visualize data", completed: false },
          { id: idCounter++, title: "Statistical Methods", description: "Apply statistical methods to data", completed: false },
          { id: idCounter++, title: "Python for Data Science", description: "Use Python libraries like Pandas and NumPy", completed: false },
          { id: idCounter++, title: "R Programming", description: "Learn R for statistical analysis", completed: false }
        ];
        break;
        
      case "Cloud Services":
        subItems = [
          { id: idCounter++, title: "Cloud Fundamentals", description: "Understand cloud service models", completed: false },
          { id: idCounter++, title: "AWS Certification", description: "Prepare for AWS certification", completed: false },
          { id: idCounter++, title: "Serverless Architecture", description: "Build serverless applications", completed: false },
          { id: idCounter++, title: "Cloud Security", description: "Implement cloud security best practices", completed: false }
        ];
        break;
        
      default:
        subItems = [
          { id: idCounter++, title: "Core Concepts", description: "Learn fundamentals of this area", completed: false },
          { id: idCounter++, title: "Practical Application", description: "Apply concepts to real projects", completed: false },
          { id: idCounter++, title: "Advanced Topics", description: "Explore advanced techniques", completed: false }
        ];
    }
    
    // Filter for relevant core skills to this area
    if (coreSkills && coreSkills.length) {
      // Map relevant skills to this development area
      const areaToSkillsMap = {
        "Machine Learning": ["Machine Learning", "Python", "TensorFlow", "PyTorch"],
        "Data Science": ["Data Science", "Python", "R", "SQL"],
        "Cloud Services": ["AWS", "GCP", "Azure", "Docker", "Kubernetes"]
      };
      
      const relevantSkills = coreSkills.filter(skill => 
        areaToSkillsMap[area]?.some(areaSkill => 
          skill.toLowerCase().includes(areaSkill.toLowerCase())
        )
      );
      
      // Add any relevant skills from core skills that aren't already in subitems
      relevantSkills.forEach(skill => {
        const skillAlreadyIncluded = subItems.some(item => 
          item.title.toLowerCase().includes(skill.toLowerCase())
        );
        
        if (!skillAlreadyIncluded) {
          subItems.push({
            id: idCounter++,
            title: skill,
            description: `Master ${skill} for ${area}`,
            completed: false
          });
        }
      });
    }
    
    return subItems;
  };

  // Function to toggle section expansion
  const toggleSectionExpand = (sectionId) => {
    if (!roadmapData) return;
    
    setRoadmapData(prevData => ({
      ...prevData,
      sections: prevData.sections.map(section => 
        section.id === sectionId ? { ...section, expanded: !section.expanded } : section
      )
    }));
  };

  // Function to toggle section completion
  const toggleSectionComplete = (sectionId, e) => {
    e.stopPropagation();
    if (!roadmapData) return;
    
    setRoadmapData(prevData => {
      const updatedSections = prevData.sections.map(section => {
        if (section.id === sectionId) {
          const newCompletedState = !section.completed;
          return {
            ...section,
            completed: newCompletedState,
            subItems: section.subItems.map(item => ({
              ...item,
              completed: newCompletedState
            }))
          };
        }
        return section;
      });
      
      return { ...prevData, sections: updatedSections };
    });
  };

  // Function to toggle subitem completion
  const toggleSubItemComplete = (sectionId, subItemId) => {
    if (!roadmapData) return;
    
    setRoadmapData(prevData => {
      const updatedSections = prevData.sections.map(section => {
        if (section.id === sectionId) {
          const updatedSubItems = section.subItems.map(item => 
            item.id === subItemId ? { ...item, completed: !item.completed } : item
          );
          
          // If all subitems are completed, mark the section as completed
          const allSubItemsCompleted = updatedSubItems.every(item => item.completed);
          
          return {
            ...section,
            subItems: updatedSubItems,
            completed: allSubItemsCompleted
          };
        }
        return section;
      });
      
      return { ...prevData, sections: updatedSections };
    });
  };

  // Function to calculate completion progress
  const calculateProgress = () => {
    if (!roadmapData) return 0;
    
    const totalSubItems = roadmapData.sections.reduce((acc, section) => 
      acc + section.subItems.length, 0);
    
    const completedSubItems = roadmapData.sections.reduce((acc, section) => 
      acc + section.subItems.filter(item => item.completed).length, 0);
    
    return totalSubItems > 0 ? Math.round((completedSubItems / totalSubItems) * 100) : 0;
  };

  // Function to handle test taking
  const handleTakeTest = (sectionId, e) => {
    e.stopPropagation();
    setActiveTest(sectionId);
    
    // In a real application, this would navigate to a test or open a modal
    alert(`Taking test for section ${sectionId}. In a real application, this would open the test.`);
  };

  // Loading state
  if (!roadmapData) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-gray-900 rounded-xl shadow-2xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
          {[1, 2, 3].map((n) => (
            <div key={n} className="mb-6">
              <div className="h-16 bg-gray-800 rounded-lg mb-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto p-8 bg-gray-900 rounded-xl shadow-2xl transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
        <span className="mr-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-md p-1">
          <Star className="w-6 h-6" />
        </span>
        {roadmapData.title}
      </h1>
      <p className="text-gray-400 mb-4">{roadmapData.description}</p>
      
      {/* Market Insights Section */}
      {roadmapData.marketInfo && (
        <div className="p-4 bg-gray-800 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-white mb-2">Market Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-700 rounded">
              <h3 className="text-sm text-gray-400">Average Salary</h3>
              <p className="text-blue-400 font-medium">{roadmapData.marketInfo.averageSalary}</p>
            </div>
            <div className="p-3 bg-gray-700 rounded">
              <h3 className="text-sm text-gray-400">Market Demand</h3>
              <p className="text-green-400 font-medium">{roadmapData.marketInfo.demand}</p>
            </div>
            <div className="p-3 bg-gray-700 rounded">
              <h3 className="text-sm text-gray-400">Top Industries</h3>
              <p className="text-purple-400 font-medium">{roadmapData.marketInfo.topIndustries?.join(", ")}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Core Skills */}
      {passedRoadmapData && passedRoadmapData.coreTechnicalSkills && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-2">Core Technical Skills</h2>
          <div className="flex flex-wrap gap-2">
            {passedRoadmapData.coreTechnicalSkills.map((skill, index) => (
              <span key={index} className="px-3 py-1 rounded-full bg-gray-800 text-blue-400 text-sm border border-blue-500/30">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">Overall Progress</span>
          <span className="text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent font-bold">{calculateProgress()}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-700 ease-out" 
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
      </div>
      
      {/* Roadmap Sections */}
      <div className="space-y-6">
        {roadmapData.sections.map((section, index) => (
          <div 
            key={section.id} 
            className={`border rounded-xl overflow-hidden transition-all duration-500 ease-in-out ${
              animate ? `opacity-100 translate-y-0` : 'opacity-0 translate-y-4'
            } ${section.completed ? 'border-blue-500 bg-gray-800/50' : 'border-gray-700 bg-gray-800'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {/* Section Header */}
            <div 
              className="flex items-center p-5 cursor-pointer hover:bg-gray-800 transition-colors duration-300" 
              onClick={() => toggleSectionExpand(section.id)}
            >
              <div className="flex-shrink-0 mr-4">
                <div className={`p-2 rounded-lg ${section.completed ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-400'}`}>
                  {section.icon || <Code />}
                </div>
              </div>
              
              <button 
                onClick={(e) => toggleSectionComplete(section.id, e)}
                className="flex-shrink-0 mr-4 focus:outline-none transition-transform duration-300 hover:scale-110"
                aria-label={section.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {section.completed ? (
                  <CheckCircle className="w-6 h-6 text-blue-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-500" />
                )}
              </button>
              
              <div className="flex-grow">
                <h3 className={`font-semibold text-lg ${section.completed ? 'text-blue-400' : 'text-white'}`}>
                  {section.title}
                </h3>
                <p className="text-sm text-gray-400">{section.description}</p>
              </div>
              
              <button 
                className="flex-shrink-0 ml-4 focus:outline-none transition-transform duration-300"
                aria-label={section.expanded ? "Collapse section" : "Expand section"}
              >
                {section.expanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            
            {/* Sub Items */}
            <div 
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                section.expanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="bg-gray-900 border-t border-gray-700">
                {section.subItems.map((item, itemIndex) => (
                  <div 
                    key={item.id} 
                    className={`flex items-start p-4 transition-all duration-300 ease-in-out ${
                      item.completed ? 'bg-blue-900/20' : 'hover:bg-gray-800'
                    }`}
                    style={{ transitionDelay: `${itemIndex * 50}ms` }}
                  >
                    <button 
                      onClick={() => toggleSubItemComplete(section.id, item.id)}
                      className="flex-shrink-0 mr-4 mt-1 focus:outline-none transition-transform duration-300 hover:scale-110"
                      aria-label={item.completed ? "Mark as incomplete" : "Mark as complete"}
                    >
                      {item.completed ? (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    
                    <div className="flex-grow">
                      <h4 className={`font-medium ${item.completed ? 'text-blue-400' : 'text-gray-200'} transition-colors duration-300`}>
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Take Test Button - Only shown for sections with tests available */}
              {section.testAvailable && (
                <div className="p-4 bg-gray-900 border-t border-gray-700 flex justify-end">
                  <button
                    onClick={(e) => handleTakeTest(section.id, e)}
                    className="flex items-center px-4 py-2 rounded-lg transition-all duration-300 focus:outline-none 
                      bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg hover:shadow-blue-500/20"
                  >
                    <FileCheck className="w-4 h-4 mr-2" />
                    <span>Take Test</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}