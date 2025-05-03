import React, { useState, useEffect } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

const IndustryInsights = () => {
  const [allArticles, setAllArticles] = useState([]); // Store all articles from API
  const [displayedArticles, setDisplayedArticles] = useState([]); // Articles to display
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [articlesPerPage, setArticlesPerPage] = useState(6); // Number of articles to display initially
  const [currentPage, setCurrentPage] = useState(1);

  // Fixed job role and country
  const jobRole = "Software Developer";
  const country = "India";

  // Get API key from environment variables
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      setError("API key not found. Please check your environment variables.");
      setLoading(false);
      return;
    }

    // Initial search with the job role
    fetchNews(`${jobRole}`);
  }, [apiKey]);

  // Apply filters and update displayed articles whenever filters, sort, or pagination changes
  useEffect(() => {
    updateDisplayedArticles();
  }, [selectedSource, sortBy, currentPage, allArticles]);

  const fetchNews = async (query = "") => {
    setLoading(true);
    try {
      const url = `https://gnews.io/api/v4/search?q=${query}&token=${apiKey}&lang=en`;
      //   const url = `https://gnews.io/api/v4/search?q=${query}&token=${apiKey}&lang=en`;
      console.log(`Fetching news from: ${url}`); // Debugging line
      const response = await axios.get(url);

      if (response.data && response.data.articles) {
        setAllArticles(response.data.articles);
        setError(null);
        // Reset pagination when new search is performed
        setCurrentPage(1);
      } else {
        setError("No articles found");
        setAllArticles([]);
      }
    } catch (err) {
      setError(`Error fetching news: ${err.message}`);
      setAllArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) {
      fetchNews(`${jobRole}`);
    } else {
      fetchNews(`${jobRole} ${searchQuery}`);
    }
  };

  const getSources = () => {
    const sources = allArticles.map((article) => article.source.name);
    return [...new Set(sources)];
  };

  // Function to apply filters and sorting
  const getFilteredArticles = () => {
    let filtered = [...allArticles];

    if (selectedSource) {
      filtered = filtered.filter(
        (article) => article.source.name === selectedSource
      );
    }

    if (sortBy === "newest") {
      filtered.sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      );
    } else if (sortBy === "oldest") {
      filtered.sort(
        (a, b) => new Date(a.publishedAt) - new Date(b.publishedAt)
      );
    }

    return filtered;
  };

  // Update displayed articles based on filters and pagination
  const updateDisplayedArticles = () => {
    const filtered = getFilteredArticles();
    const startIndex = 0;
    const endIndex = currentPage * articlesPerPage;
    setDisplayedArticles(filtered.slice(startIndex, endIndex));
  };

  // Load more articles
  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // Skeleton loader array
  const skeletons = Array(6).fill(0);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Navbar */}
        <nav className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <svg
              className="w-8 h-8 text-purple-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
              <path d="M18 14h-8"></path>
              <path d="M15 18h-5"></path>
              <path d="M10 6h8v4h-8V6Z"></path>
            </svg>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Tech Career News
            </h1>
          </div>

          <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
            <div className="px-4 py-2 bg-gray-800 rounded-lg flex items-center gap-2 text-purple-500 font-medium">
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              {jobRole}
            </div>

            <div className="px-4 py-2 bg-gray-800 rounded-lg flex items-center gap-2 text-purple-500 font-medium">
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                <path d="M2 12h20"></path>
              </svg>
              {country}
            </div>
          </div>
        </nav>

        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for news..."
                className="w-full bg-gray-800 text-white rounded-l-lg pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-r-lg transition duration-200"
            >
              Search
            </button>
          </form>

          <button
            type="button"
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-lg transition duration-200"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            {selectedSource ? `Filters (1)` : `Filters`}
          </button>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              className="bg-gray-800 rounded-lg mb-8 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">
                    News Source:
                  </label>
                  <select
                    value={selectedSource}
                    onChange={(e) => {
                      setSelectedSource(e.target.value);
                      setCurrentPage(1); // Reset to first page when changing filters
                    }}
                    className="bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23b3b3b3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 10px center",
                      backgroundSize: "16px",
                    }}
                  >
                    <option value="">All Sources</option>
                    {getSources().map((source, index) => (
                      <option key={index} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-400">
                    Sort By:
                  </label>
                  <div className="flex gap-3">
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                        sortBy === "newest"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                      onClick={() => {
                        setSortBy("newest");
                        setCurrentPage(1); // Reset to first page when changing sort
                      }}
                    >
                      Newest First
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                        sortBy === "oldest"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                      onClick={() => {
                        setSortBy("oldest");
                        setCurrentPage(1); // Reset to first page when changing sort
                      }}
                    >
                      Oldest First
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-3 bg-red-900/30 text-red-400 px-6 py-4 rounded-lg mb-8">
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>{error}</p>
          </div>
        )}

        {/* News stats */}
        {!loading && !error && (
          <div className="mb-4 text-gray-400 text-sm">
            <span>
              Showing {displayedArticles.length} of{" "}
              {getFilteredArticles().length} articles
              {selectedSource && ` from ${selectedSource}`}
            </span>
          </div>
        )}

        {/* Skeleton loader */}
        {loading ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {skeletons.map((_, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 rounded-lg overflow-hidden"
                variants={itemVariants}
              >
                <div className="h-48 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse"></div>
                <div className="p-5 space-y-4">
                  <div className="h-6 w-3/4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse rounded"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse rounded"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse rounded"></div>
                  <div className="flex justify-between">
                    <div className="h-4 w-1/4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse rounded"></div>
                    <div className="h-4 w-1/4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse rounded"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Articles grid */
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {displayedArticles.map((article, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                    variants={itemVariants}
                    layout
                    whileHover={{ y: -8 }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      {article.image ? (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/300x200?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-700">
                          <svg
                            className="w-12 h-12 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            ></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full">
                        {article.source.name}
                      </div>
                    </div>

                    <div className="p-5">
                      <h2 className="text-lg font-semibold mb-3 line-clamp-2">
                        {article.title}
                      </h2>
                      <p className="text-gray-400 text-sm mb-5 line-clamp-3">
                        {article.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs">
                          {new Date(article.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-purple-500 hover:text-purple-400 text-sm font-medium transition duration-200"
                        >
                          Read
                          <svg
                            className="w-4 h-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Load More button */}
            {!loading &&
              displayedArticles.length < getFilteredArticles().length && (
                <div className="flex justify-center mt-10">
                  <motion.button
                    onClick={handleLoadMore}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-8 py-3 rounded-lg transition duration-200 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Show More
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </motion.button>
                </div>
              )}
          </>
        )}

        {/* Empty state */}
        {!loading && !error && displayedArticles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <svg
              className="w-12 h-12 text-gray-600 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 15h8"></path>
              <path d="M9 9h.01"></path>
              <path d="M15 9h.01"></path>
            </svg>
            <p className="text-gray-500 text-lg">
              No articles found. Try a different search term or filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndustryInsights;
