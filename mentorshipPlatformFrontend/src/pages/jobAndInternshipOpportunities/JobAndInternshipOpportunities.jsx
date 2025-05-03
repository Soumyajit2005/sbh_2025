import { useState, useEffect } from 'react';
import { Search, Briefcase, MapPin, DollarSign, Calendar, ExternalLink, ChevronRight, ChevronLeft, AlertCircle, Globe } from 'lucide-react';

// API credentials - in a real app, these would be environment variables
const APP_ID = import.meta.env.VITE_ADZUNA_APP_ID;
const APP_KEY = import.meta.env.VITE_ADZUNA_APP_KEY;

// Available countries in Adzuna API
const COUNTRIES = [
  { code: "gb", name: "United Kingdom" },
  { code: "us", name: "United States" },
  { code: "au", name: "Australia" },
  { code: "br", name: "Brazil" },
  { code: "ca", name: "Canada" },
  { code: "de", name: "Germany" },
  { code: "fr", name: "France" },
  { code: "in", name: "India" },
  { code: "it", name: "Italy" },
  { code: "nl", name: "Netherlands" },
  { code: "nz", name: "New Zealand" },
  { code: "pl", name: "Poland" },
  { code: "ru", name: "Russia" },
  { code: "sg", name: "Singapore" },
  { code: "za", name: "South Africa" },
  { code: "es", name: "Spain" },
  { code: "se", name: "Sweden" },
  { code: "ch", name: "Switzerland" },
  { code: "tr", name: "Turkey" },
  { code: "ae", name: "United Arab Emirates" },
  { code: "jp", name: "Japan" },
  { code: "kr", name: "South Korea" },
  { code: "hk", name: "Hong Kong" },
  { code: "my", name: "Malaysia" },
  { code: "ph", name: "Philippines" },
  {code: "in", name: "India" },
  { code: "id", name: "Indonesia" },
  { code: "th", name: "Thailand" },
  { code: "vn", name: "Vietnam" },
  { code: "cl", name: "Chile" },
  { code: "co", name: "Colombia" },
  { code: "pe", name: "Peru" },
  { code: "mx", name: "Mexico" },
  { code: "ar", name: "Argentina" },
  { code: "uy", name: "Uruguay" },
];

export default function JobAndInternshipOpportunities() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchTerm, setSearchTerm] = useState("backend developer");
  const [searchInput, setSearchInput] = useState("backend developer");
  const [country, setCountry] = useState("gb");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  // Animation states
  const [fadeIn, setFadeIn] = useState(false);
  
  useEffect(() => {
    setFadeIn(true);
    fetchJobs(currentPage, searchTerm, country);
  }, [currentPage, searchTerm, country]);
  
  const fetchJobs = async (page, term, countryCode) => {
    setLoading(true);
    setError(null);
    setSelectedJob(null);
    
    try {
      const apiUrl = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/${page}?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=10&what=${encodeURIComponent(term)}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      setJobs(data.results || []);
      setTotalJobs(data.count || 0);
      
      // Select first job by default if available
      if (data.results && data.results.length > 0) {
        setSelectedJob(data.results[0]);
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchTerm(searchInput);
  };
  
  const handleCountryChange = (countryCode) => {
    setCountry(countryCode);
    setCurrentPage(1);
    setShowCountryDropdown(false);
  };
  
  const getCountryName = (code) => {
    const foundCountry = COUNTRIES.find(c => c.code === code);
    return foundCountry ? foundCountry.name : code.toUpperCase();
  };
  
  const handleJobClick = (job) => {
    setSelectedJob(job);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };
  
  const formatSalary = (min, max) => {
    if (min === max) {
      return `£${Math.round(min).toLocaleString()}`;
    }
    return `£${Math.round(min).toLocaleString()} - £${Math.round(max).toLocaleString()}`;
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  return (
    <div className={`min-h-screen bg-gray-900 text-gray-200 transition-opacity duration-700 ease-in-out ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <header className="bg-gray-800 py-4 px-6 shadow-lg">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Briefcase className="text-purple-500 mr-2" size={28} />
            <h1 className="text-2xl font-bold text-purple-400">Job Explorer</h1>
          </div>
          <div className="w-full md:w-auto">
            <form onSubmit={handleSearch} className="w-full">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="bg-gray-700 hover:bg-gray-600 text-white w-full sm:w-44 px-4 py-2 rounded-lg flex items-center justify-between transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <Globe size={18} className="mr-2 text-purple-400" />
                      <span>{getCountryName(country)}</span>
                    </div>
                    <ChevronRight className={`transition-transform duration-300 ${showCountryDropdown ? 'rotate-90' : ''}`} size={16} />
                  </button>
                  
                  {showCountryDropdown && (
                    <div className="absolute mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
                      <ul>
                        {COUNTRIES.map((c) => (
                          <li key={c.code}>
                            <button
                              type="button"
                              onClick={() => handleCountryChange(c.code)}
                              className={`w-full text-left px-4 py-2 hover:bg-gray-600 transition-colors duration-150 ${country === c.code ? 'bg-gray-600 text-purple-400' : 'text-white'}`}
                            >
                              {c.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-700 rounded-lg p-2 flex items-center flex-1">
                  <Search className="text-gray-400 mr-2" size={20} />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search jobs by title or keyword..."
                    className="bg-transparent border-none focus:outline-none text-white w-full"
                  />
                  <button 
                    type="submit" 
                    className="ml-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded transition-colors duration-200"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {error ? (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 flex items-center">
            <AlertCircle className="text-red-500 mr-3" size={24} />
            <div>
              <h3 className="text-xl font-bold text-red-400">Error Loading Jobs</h3>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Job listings panel */}
            <div className="w-full lg:w-1/3">
              <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700 h-full">
                <div className="p-4 border-b border-gray-700 bg-gray-800">
                  <h2 className="text-xl font-bold text-purple-300">
                    {loading ? 'Loading Jobs...' : `${totalJobs} Jobs for "${searchTerm}" in ${getCountryName(country)}`}
                  </h2>
                </div>
                
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : (
                  <>
                    <ul className="divide-y divide-gray-700">
                      {jobs.map((job) => (
                        <li 
                          key={job.id}
                          onClick={() => handleJobClick(job)}
                          className={`p-4 transition-all duration-300 ease-in-out cursor-pointer hover:bg-gray-700 
                            ${selectedJob?.id === job.id ? 'bg-gray-700 border-l-4 border-purple-500' : ''}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-white">{job.title}</h3>
                              <p className="text-sm text-gray-400">{job.company?.display_name || 'Unknown Company'}</p>
                              <div className="flex items-center mt-2 text-xs text-gray-400">
                                <MapPin size={14} className="mr-1" />
                                <span>{job.location?.display_name || 'Remote'}</span>
                              </div>
                            </div>
                            <ChevronRight size={18} className={`text-purple-400 transition-transform duration-300 ${selectedJob?.id === job.id ? 'rotate-90' : ''}`} />
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    {jobs.length === 0 && !loading && (
                      <div className="p-8 text-center text-gray-400">
                        <p>No jobs found. Try a different search.</p>
                      </div>
                    )}
                    
                    {/* Pagination */}
                    <div className="p-4 border-t border-gray-700 flex justify-between items-center">
                      <button 
                        onClick={handlePrevPage} 
                        disabled={currentPage === 1}
                        className={`flex items-center px-3 py-1 rounded ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-purple-400 hover:bg-gray-700'}`}
                      >
                        <ChevronLeft size={18} className="mr-1" />
                        Previous
                      </button>
                      <span className="text-gray-400">Page {currentPage}</span>
                      <button 
                        onClick={handleNextPage}
                        className="flex items-center px-3 py-1 rounded text-purple-400 hover:bg-gray-700"
                      >
                        Next
                        <ChevronRight size={18} className="ml-1" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Job details panel */}
            <div className="w-full lg:w-2/3">
              {selectedJob ? (
                <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700 transition-all duration-500 ease-in-out animate-fadeIn">
                  <div className="p-6 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedJob.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center text-gray-300">
                        <Briefcase size={16} className="mr-1 text-purple-400" />
                        {selectedJob.company?.display_name || 'Unknown Company'}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <MapPin size={16} className="mr-1 text-purple-400" />
                        {selectedJob.location?.display_name || 'Remote'}
                      </div>
                      {selectedJob.created && (
                        <div className="flex items-center text-gray-300">
                          <Calendar size={16} className="mr-1 text-purple-400" />
                          Posted {formatDate(selectedJob.created)}
                        </div>
                      )}
                      {(selectedJob.salary_min || selectedJob.salary_max) && (
                        <div className="flex items-center text-gray-300">
                          <DollarSign size={16} className="mr-1 text-purple-400" />
                          {formatSalary(selectedJob.salary_min, selectedJob.salary_max)}
                          {selectedJob.salary_is_predicted === "1" && <span className="text-xs ml-1 text-gray-500">(Estimated)</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-purple-300 mb-2">Description</h3>
                      <p className="text-gray-300 whitespace-pre-line">{selectedJob.description}</p>
                    </div>
                    
                    <div className="flex justify-end">
                      <a 
                        href={selectedJob.redirect_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105"
                      >
                        Apply Now
                        <ExternalLink size={18} className="ml-2" />
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-12 flex flex-col items-center justify-center h-full">
                  <Briefcase size={48} className="text-gray-600 mb-4" />
                  <p className="text-gray-400 text-center text-lg">
                    {loading ? "Loading jobs..." : "Select a job to view details"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      
      {/* Global styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}