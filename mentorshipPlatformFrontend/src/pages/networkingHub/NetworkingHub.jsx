import { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, MapPin, MessageSquare, UserPlus, X, ChevronDown, ChevronUp, Star, Loader } from 'lucide-react';
import {Avatar} from "@heroui/react";

// API endpoint for fetching connections
const API_ENDPOINT = "http://127.0.0.1:8080/recommendations/";

export default function NetworkingHub() {
  // State for data and UI
  const [connections, setConnections] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    company: [],
    skills: [],
    location: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalConnections, setTotalConnections] = useState(0);
  
  // State for filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    company: [],
    skills: [],
    location: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteConnections, setFavoriteConnections] = useState([]);
  
  // Optional: Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Extract filter options from profiles
  const extractFilterOptions = (profiles) => {
    const companies = new Set();
    const skills = new Set();
    const locations = new Set();
    
    profiles.forEach(profile => {
      // Extract company from title (format: "... working at CompanyName")
      const companyMatch = profile.title.match(/working at ([^,\.]+)/);
      if (companyMatch && companyMatch[1]) {
        companies.add(companyMatch[1].trim());
      }
      
      // Extract skills from title (format: "... with experience in Skill1, Skill2, Skill3 ...")
      const skillsMatch = profile.title.match(/experience in ([^working]+)/);
      if (skillsMatch && skillsMatch[1]) {
        const skillsList = skillsMatch[1].split(',').map(skill => skill.trim());
        skillsList.forEach(skill => {
          if (skill) skills.add(skill);
        });
      }
      
      // For location, we'd normally extract it from profile data
      // Since it's not in the API response, we'll use placeholder locations
      // In a real implementation, you would extract actual locations from your API data
    });
    
    return {
      company: Array.from(companies),
      skills: Array.from(skills),
      location: ["Bangalore, India", "Mumbai, India", "Hyderabad, India", "Remote"] // Placeholder locations
    };
  };

  const job_title = "Frontend Developer"

  // Function to fetch connections from API
  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_ENDPOINT}?job_title=${job_title}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process the data to add necessary fields
      const processedData = data.results.map((profile, index) => ({
        ...profile,
        id: index + 1, // Generate unique ID
        profileImg: "/api/placeholder/80/80", // Placeholder image
        mutual: Math.floor(Math.random() * 15) + 1, // Random number of mutual connections
        lastActive: ["1h", "2h", "3h", "1d", "2d", "3d"][Math.floor(Math.random() * 6)] // Random last active time
      }));
      
      // Extract filter options if they haven't been set yet
      if (Object.values(filterOptions).some(arr => arr.length === 0)) {
        const options = extractFilterOptions(processedData);
        setFilterOptions(options);
      }
      
      let filteredData = [...processedData];
      
      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredData = filteredData.filter(conn => 
          conn.name.toLowerCase().includes(query) || 
          conn.title.toLowerCase().includes(query) || 
          conn.summary.toLowerCase().includes(query)
        );
      }
      
      // Apply company filters
      if (filters.company.length > 0) {
        filteredData = filteredData.filter(conn => 
          filters.company.some(company => conn.title.includes(company))
        );
      }
      
      // Apply skills filters
      if (filters.skills.length > 0) {
        filteredData = filteredData.filter(conn => 
          filters.skills.some(skill => conn.title.includes(skill))
        );
      }
      
      // Apply location filters
      if (filters.location.length > 0) {
        // In a real implementation, you would filter by actual location data
        // For now, we'll assume all profiles match any selected location
        // This should be updated when your API provides location data
      }
      
      setConnections(filteredData);
      setTotalConnections(processedData.length);
      setHasMore(false);
      
    } catch (err) {
      console.error("Error fetching connections:", err);
      setError("Failed to load profiles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle favorite status
  const toggleFavorite = (id) => {
    const isFavorite = favoriteConnections.includes(id);
    
    setFavoriteConnections(prev => 
      isFavorite 
        ? prev.filter(fId => fId !== id) 
        : [...prev, id]
    );
  };

  // Load data on initial mount
  useEffect(() => {
    fetchConnections();
  }, []);
  
  // Fetch connections when search, filters or page changes
  useEffect(() => {
    if (!loading) {
      fetchConnections();
    }
  }, [searchQuery, filters, page]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  // Handle filter changes
  const toggleFilter = (category, value) => {
    setFilters(prevFilters => {
      const updatedCategory = prevFilters[category].includes(value)
        ? prevFilters[category].filter(item => item !== value)
        : [...prevFilters[category], value];
      
      return {
        ...prevFilters,
        [category]: updatedCategory
      };
    });
    setPage(1); // Reset to first page on filter change
  };

  // Reset all filters
  const clearFilters = () => {
    setFilters({
      company: [],
      skills: [],
      location: []
    });
    setSearchQuery("");
    setPage(1);
  };

  // Load more connections
  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-4xl mx-auto text-gray-200">
      <h2 className="text-2xl font-bold text-blue-400 mb-6">People You Can Connect With</h2>
      
      {/* Search and filter section */}
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or content"
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-700 w-full bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 text-gray-200"
          >
            <Filter size={18} />
            <span>Filters</span>
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        
        {/* Expandable filter panel */}
        {showFilters && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-200">Filter Profiles</h3>
              <button 
                onClick={clearFilters}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Clear all
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Company Filter */}
              <div>
                <h4 className="font-medium text-gray-300 mb-2">Company</h4>
                <div className="space-y-1">
                  {filterOptions.company?.map(option => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.company.includes(option)}
                        onChange={() => toggleFilter('company', option)}
                        className="mr-2 bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-opacity-50"
                      />
                      <span className="text-gray-300">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Skills Filter */}
              <div>
                <h4 className="font-medium text-gray-300 mb-2">Skills</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {filterOptions.skills?.map(option => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.skills.includes(option)}
                        onChange={() => toggleFilter('skills', option)}
                        className="mr-2 bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-opacity-50"
                      />
                      <span className="text-gray-300">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Location Filter */}
              <div>
                <h4 className="font-medium text-gray-300 mb-2">Location</h4>
                <div className="space-y-1">
                  {filterOptions.location?.map(option => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.location.includes(option)}
                        onChange={() => toggleFilter('location', option)}
                        className="mr-2 bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-opacity-50"
                      />
                      <span className="text-gray-300">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Applied filters */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(filters).flatMap(category => 
            filters[category].map(value => (
              <div key={`${category}-${value}`} className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full flex items-center text-sm">
                <span className="capitalize mr-1">{category}:</span>
                <span>{value}</span>
                <button 
                  onClick={() => toggleFilter(category, value)}
                  className="ml-1 focus:outline-none"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
          {(searchQuery || Object.values(filters).some(arr => arr.length > 0)) && (
            <button 
              onClick={clearFilters}
              className="text-sm text-blue-400 hover:text-blue-300 underline"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader size={32} className="animate-spin text-blue-400" />
          <span className="ml-2 text-gray-300">Loading profiles...</span>
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-4">
          <p>{error}</p>
          <button 
            onClick={fetchConnections}
            className="mt-2 text-red-200 underline hover:text-white"
          >
            Try again
          </button>
        </div>
      )}
      
      {/* Connection list */}
      {!loading && !error && (
        <div className="space-y-4">
          {connections.length > 0 ? (
            connections.map(connection => (
              <div key={connection.id} className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-blue-500 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {/* <div className="w-20 h-20 bg-gray-700 rounded-full overflow-hidden">
                      <img 
                        src="/api/placeholder/80/80" 
                        alt={connection.name} 
                        className="w-full h-full object-cover"
                      />
                    </div> */}
                    <Avatar showFallback src="https://images.unsplash.com/broken" />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="mb-2">
                          <span className="font-semibold text-gray-400">Name:</span> 
                          <span className="font-semibold text-lg text-blue-300 ml-2">{connection.name}</span>
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold text-gray-400">Title:</span> 
                          <span className="text-gray-300 ml-2">{connection.title}</span>
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold text-gray-400">LinkedIn:</span> 
                          <a href={connection.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 ml-2">{connection.linkedin}</a>
                        </div>
                        <div className="mb-3">
                          <span className="font-semibold text-gray-400">Summary:</span> 
                          <p className="text-gray-300 mt-1">{connection.summary}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => toggleFavorite(connection.id)}
                        className="p-1 rounded-full hover:bg-gray-700"
                      >
                        <Star size={20} 
                          className={favoriteConnections.includes(connection.id) ? 
                            "fill-yellow-400 text-yellow-400" : "text-gray-600"} 
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                      <span>{connection.mutual} mutual connections</span>
                      <span>•</span>
                      <span>Active {connection.lastActive} ago</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        <MessageSquare size={16} className="mr-1" />
                        <span>Message</span>
                      </button>
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-600 rounded-md hover:bg-gray-700 text-gray-200">
                        <UserPlus size={16} className="mr-1" />
                        <span>Connect</span>
                      </button>
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-600 rounded-md hover:bg-gray-700 text-gray-200">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-gray-400">No profiles match your filters. Try adjusting your search criteria.</p>
              <button 
                onClick={clearFilters}
                className="mt-3 text-blue-400 hover:text-blue-300"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Pagination / Load more */}
      {!loading && !error && connections.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-gray-400 mb-2">
            Showing {connections.length} of {totalConnections} profiles
          </p>
          {hasMore && (
            <button
              onClick={loadMore}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Load more profiles
            </button>
          )}
        </div>
      )}
    </div>
  );
}