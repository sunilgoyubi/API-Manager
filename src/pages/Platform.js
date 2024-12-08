import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Box, ArrowRight,  Link2 } from "lucide-react";

const Platform = () => {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  const navigate = useNavigate();

  const fetchApis = async (query = "") => {
    try {
      const url = query
        ? `http://localhost:8080/admin/search?name=${query}`
        : "http://localhost:8080/admin/list";

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch API data");
      }

      const data = await response.json();
      setApis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApis();
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchApis(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const groupedApis = apis.reduce((acc, api) => {
    if (!acc[api.name]) {
      acc[api.name] = [];
    }
    acc[api.name].push(api);
    return acc;
    
  }, {});

  const handleCardClick = (apiName) => {
    navigate(`/api-details/${apiName}`);
  };

  

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-pulse flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">API Platform</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Manage and monitor your APIs in one place. View documentation, test endpoints, and track usage.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search APIs by name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
            />
          </div>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* API Grid */}
        {Object.keys(groupedApis).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedApis).map(([apiName, apiList], index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  onClick={() => handleCardClick(apiName)}
                  className="cursor-pointer bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 h-full"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Box className="h-6 w-6 text-blue-500" />
                      <h2 className="text-xl font-semibold text-slate-900">{apiName}</h2>
                    </div>
                    {/* <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handleEditClick(e, apiName)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4 text-slate-600" />
                      </button>
                    </div> */}
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Link2 className="h-4 w-4" />
                      <span className="text-sm font-mono truncate">
                        {apiList[0].baseUri}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                        Endpoint {apiList[0].endUris.length}
                      </span>
                    </div>
                      
                      <ArrowRight 
                        className={`h-5 w-5 text-blue-500 transform transition-transform duration-200 ${
                          hoveredCard === index ? 'translate-x-1' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Box className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No APIs Found</h3>
            <p className="text-slate-600">
              {searchQuery 
                ? "No APIs match your search criteria. Try a different search term."
                : "Get started by adding your first API through the Admin page."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Platform;