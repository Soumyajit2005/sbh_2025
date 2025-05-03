import { useState, useEffect, useRef } from 'react';
import { FileText, Upload, MessageSquare, CheckCircle, AlertCircle, Send, ArrowRight, Award, Zap } from 'lucide-react';

export default function ResumeEvaluator() {
  const [activeTab, setActiveTab] = useState('evaluate');
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [animateIn, setAnimateIn] = useState(false);
  const [error, setError] = useState('');
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Trigger entrance animation
    setAnimateIn(true);
  }, []);

  useEffect(() => {
    // Scroll to bottom of chat when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setError('');
    }
  };

  const parseEvaluationResponse = (responseText) => {
    // Improved regex for extracting the percentage match
    const percentageMatch = responseText.match(/Percentage Match:?\s*(\d+)%/i) || 
                           responseText.match(/Match:?\s*(\d+)%/i) ||
                           responseText.match(/Score:?\s*(\d+)%/i) ||
                           responseText.match(/(\d+)%\s*match/i);
    
    const score = percentageMatch ? parseInt(percentageMatch[1]) : 0;
    console.log('Parsed score:', score);
    
    // Improved regex for extracting missing keywords section with better boundary detection
    const keywordsMissing = responseText.match(/Keywords Missing:([^]*?)(?=\n\n\*\*|$)/s) || 
                            responseText.match(/Missing Keywords:([^]*?)(?=\n\n\*\*|$)/s) ||
                            responseText.match(/Areas for Improvement:([^]*?)(?=\n\n\*\*|$)/s);
    
    const keywordsMissingText = keywordsMissing ? keywordsMissing[1].trim() : '';
    
    // Improved regex for extracting final thoughts section with better boundary detection
    const finalThoughts = responseText.match(/Final Thoughts:([^]*?)(?=\n\n\*\*|$)/s) || 
                          responseText.match(/Strengths:([^]*?)(?=\n\n\*\*|$)/s) ||
                          responseText.match(/Recommendations:([^]*?)(?=\n\n\*\*|$)/s);
    
    const finalThoughtsText = finalThoughts ? finalThoughts[1].trim() : '';
    
    // Create improvements array from keywords missing with better text processing
    const improvements = keywordsMissingText
      .split(/\.|\n/)
      .map(item => item.replace(/^\s*-\s*/, '').trim())
      .filter(item => item.length > 5);
    
    // Create strengths from final thoughts with improved positive sentiment detection
    const positivePatterns = [
      /strong/i, /proficient/i, /skill/i, /demonstrate/i, /showcase/i, 
      /experience/i, /qualified/i, /impressive/i, /excellent/i, /good/i
    ];
    
    const positiveStatements = finalThoughtsText
      .split(/\.|\n/)
      .map(item => item.replace(/^\s*-\s*/, '').trim())
      .filter(item => positivePatterns.some(pattern => pattern.test(item)));
    
    // Improved keyword extraction with more relevant technical terms
    const keywordRegex = /\b(?:web|development|full-stack|front-end|back-end|react|node|javascript|python|java|cloud|aws|azure|devops|agile|machine learning|data science|frameworks|technologies|software|engineering|api|database|sql|nosql|mongodb|design|architecture)\b/gi;
    const keywordsRaw = (finalThoughtsText + ' ' + keywordsMissingText).match(keywordRegex) || [];
    const keywords = [...new Set(keywordsRaw.map(k => k.toLowerCase()))]; // Remove duplicates
    
    return {
      score,
      strengths: positiveStatements.length > 0 ? positiveStatements : ['Strong technical background', 'Relevant experience', 'Good educational qualifications'],
      improvements: improvements.length > 0 ? improvements : ['Tailor resume more specifically to job description', 'Add quantifiable achievements', 'Emphasize relevant experience'],
      keywords: keywords.length > 0 ? keywords : ['development', 'full-stack', 'web', 'frameworks']
    };
  };

  const handleEvaluate = async () => {
    if (!resumeFile) {
      setError('Please upload a resume first');
      return;
    }
    
    if (activeTab === 'evaluate' && !jobDescription) {
      setError('Please enter a job description');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    if (activeTab === 'evaluate') {
      try {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('job_description', jobDescription);
        
        const response = await fetch('http://localhost:9000/percentage_match', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data && data.response) {
          const parsedResult = parseEvaluationResponse(data.response);
          setEvaluationResult(parsedResult);
        } else {
          throw new Error('Invalid response format from API');
        }
      } catch (error) {
        console.error('Error calling API:', error);
        setError(`Failed to evaluate resume: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      // For chat tab, use the same logic as before
      setTimeout(() => {
        setChatMessages([
          { 
            sender: 'ai', 
            text: `I've analyzed your resume. What would you like to know about it or how I can help improve it?`
          }
        ]);
        setIsLoading(false);
      }, 2000);
    }
  };

  const sendChatMessage = () => {
    if (!currentMessage.trim()) return;
    
    const newMessages = [
      ...chatMessages,
      { sender: 'user', text: currentMessage }
    ];
    
    setChatMessages(newMessages);
    setCurrentMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages([
        ...newMessages,
        { 
          sender: 'ai', 
          text: respondToUserMessage(currentMessage)
        }
      ]);
    }, 1000);
  };

  const respondToUserMessage = (message) => {
    const responses = [
      "Based on your resume, I'd recommend highlighting more quantifiable achievements to stand out. Try including metrics and specific results where possible.",
      "Your technical skills section is strong, but consider reorganizing to prioritize the most relevant skills for the positions you're targeting. The job description mentions React and TypeScript prominently.",
      "Your work experience section could benefit from using the STAR method (Situation, Task, Action, Result) to make your contributions clearer and more impactful.",
      "Consider adding a more tailored professional summary that directly addresses what hiring managers in your target industry are looking for. This can make a strong first impression."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleTabChange = (tab) => {
    setAnimateIn(false);
    
    // Small delay for exit animation before changing tab
    setTimeout(() => {
      setActiveTab(tab);
      setAnimateIn(true);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6 flex justify-center">
      <div className="w-full max-w-6xl">
        <div className={`transition-all duration-500 ease-in-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800 mb-8 backdrop-blur-lg">
            <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <div className="mr-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                  <Zap className="w-6 h-6" />
                </div>
                Resume Evaluator
              </h2>
              
              <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg self-stretch sm:self-auto backdrop-blur-md">
                <button
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === 'evaluate' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                  onClick={() => handleTabChange('evaluate')}
                >
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Evaluate
                  </div>
                </button>
                <button
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === 'chat' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                  onClick={() => handleTabChange('chat')}
                >
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    AI Chat
                  </div>
                </button>
              </div>
            </div>
            
            <div className="p-6 bg-gray-900">
              <div className={`transition-all duration-500 ease-in-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Upload className="w-4 h-4 mr-2 text-purple-400" />
                        Upload Resume
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-purple-500 group backdrop-blur-sm">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <div className="w-10 h-10 mb-2 text-gray-400 group-hover:text-purple-400 transition-all duration-300 group-hover:scale-110 transform">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                            <p className="mb-1 text-sm text-gray-400 group-hover:text-white transition-colors duration-300">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PDF, DOCX (MAX. 5MB)</p>
                          </div>
                          <input type="file" className="hidden" onChange={handleResumeUpload} accept=".pdf,.docx,.doc" />
                        </label>
                      </div>
                      {resumeFile && (
                        <div className="mt-3 flex items-center text-sm text-gray-300 p-2 bg-gray-800/50 rounded-lg border border-gray-700 animate-pulse-light backdrop-blur-sm">
                          <FileText className="w-4 h-4 mr-2 text-purple-400" />
                          {resumeFile.name}
                        </div>
                      )}
                    </div>
                    
                    {activeTab === 'evaluate' && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-blue-400" />
                          Job Description
                        </label>
                        <textarea
                          className="w-full px-3 py-3 text-gray-300 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-300 backdrop-blur-sm"
                          rows="7"
                          placeholder="Paste the job description here to compare with your resume..."
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                        ></textarea>
                      </div>
                    )}
                    
                    {error && (
                      <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm backdrop-blur-sm animate-shake">
                        <div className="flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {error}
                        </div>
                      </div>
                    )}
                    
                    <button
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center hover:scale-105 hover:shadow-lg transform hover:shadow-purple-500/20"
                      onClick={handleEvaluate}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing Resume...
                        </div>
                      ) : (
                        <span className="flex items-center">
                          {activeTab === 'evaluate' ? 'Evaluate Resume' : 'Start AI Chat'}
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </span>
                      )}
                    </button>
                  </div>
                  
                  <div>
                    {activeTab === 'chat' && (
                      <div className={`h-full rounded-xl overflow-hidden border border-gray-700 transition-all duration-500 flex flex-col ${chatMessages.length > 0 ? 'opacity-100' : 'opacity-50'}`}>
                        <div className="bg-gray-800 py-2 px-4 border-b border-gray-700">
                          <h3 className="font-medium text-white flex items-center">
                            <MessageSquare className="w-4 h-4 mr-2 text-purple-400" />
                            Resume AI Assistant
                          </h3>
                        </div>
                        
                        <div 
                          className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-900" 
                          ref={chatContainerRef}
                          style={{ minHeight: "350px" }}
                        >
                          {chatMessages.length > 0 ? (
                            chatMessages.map((msg, index) => (
                              <div 
                                key={index} 
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-messageSlide`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                              >
                                <div 
                                  className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                                    msg.sender === 'user' 
                                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                      : 'bg-gray-800 text-gray-300 border border-gray-700'
                                  }`}
                                >
                                  {msg.text}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                              Upload your resume and click "Start AI Chat" to begin the conversation
                            </div>
                          )}
                        </div>
                        
                        <div className="p-3 border-t border-gray-700 bg-gray-800 mt-auto">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
                              placeholder="Ask about your resume..."
                              value={currentMessage}
                              onChange={(e) => setCurrentMessage(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                              disabled={chatMessages.length === 0}
                            />
                            <button
                              className={`bg-gradient-to-r from-purple-600 to-blue-500 text-white p-2 rounded-lg transition transform hover:scale-105 ${chatMessages.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              onClick={sendChatMessage}
                              disabled={chatMessages.length === 0}
                            >
                              <Send className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'evaluate' && evaluationResult && (
                      <div className="rounded-xl bg-gray-800/60 border border-gray-700 transform transition-all duration-500 h-full overflow-y-auto backdrop-blur-md">
                        <div className="p-5 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
                          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 flex items-center">
                            <div className="mr-2 text-purple-400">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                <path d="M2 17l10 5 10-5"></path>
                                <path d="M2 12l10 5 10-5"></path>
                              </svg>
                            </div>
                            Evaluation Results
                          </h2>
                          
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-gray-300 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-blue-400">
                                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                Match Score
                              </span>
                              <div className="flex items-center">
                                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r animate-pulse-slow
                                  from-purple-400 to-blue-500"
                                >
                                  {evaluationResult.score}%
                                </div>
                              </div>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                              <div 
                                className="h-2.5 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-size-200 animate-gradient-x"
                                style={{ width: `${evaluationResult.score}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="p-4 bg-gray-900/80 rounded-lg border border-gray-700 backdrop-blur-sm transform transition-all hover:translate-y-1 hover:shadow-lg hover:shadow-purple-500/10">
                              <h3 className="text-md font-medium mb-3 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-green-400">
                                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                Strengths
                              </h3>
                              <ul className="space-y-2">
                                {evaluationResult.strengths.map((strength, index) => (
                                  <li key={index} className="flex items-center text-gray-300 text-sm pl-1">
                                    <div className="w-1 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full mr-2 flex-shrink-0"></div>
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="p-4 bg-gray-900/80 rounded-lg border border-gray-700 backdrop-blur-sm transform transition-all hover:translate-y-1 hover:shadow-lg hover:shadow-red-500/10">
                              <h3 className="text-md font-medium mb-3 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-red-400">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="12" y1="8" x2="12" y2="12"></line>
                                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                Areas for Improvement
                              </h3>
                              <ul className="space-y-2">
                                {evaluationResult.improvements.map((improvement, index) => (
                                  <li key={index} className="flex items-center text-gray-300 text-sm pl-1">
                                    <div className="w-1 h-6 bg-gradient-to-b from-red-400 to-red-600 rounded-full mr-2 flex-shrink-0"></div>
                                    {improvement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-gray-900/80 rounded-lg border border-gray-700 backdrop-blur-sm transform transition-all hover:translate-y-1 hover:shadow-lg hover:shadow-blue-500/10">
                            <h3 className="text-md font-medium mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 text-blue-400">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                              </svg>
                              Relevant Keywords
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {evaluationResult.keywords.map((keyword, index) => (
                                <span 
                                  key={index} 
                                  className="px-3 py-1 bg-gray-800/80 text-blue-400 border border-blue-800/50 rounded-full text-xs transition-all duration-300 hover:bg-blue-900/50 hover:text-blue-200 cursor-default transform hover:scale-105 backdrop-blur-sm"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes messageSlide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes pulse-light {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-messageSlide {
          animation: messageSlide 0.3s ease-out forwards;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-pulse-light {
          animation: pulse-light 2s infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        
        .bg-size-200 {
          background-size: 200% 100%;
        }
      `}</style>
    </div>
  );
}