import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, ChevronUp, Copy, ExternalLink } from "lucide-react";

const ApiDetails = () => {
  const { apiName } = useParams();
  const [allApis, setAllApis] = useState([]);
  const [apiDetails, setApiDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedApis, setExpandedApis] = useState({});

  useEffect(() => {
    const fetchAllApis = async () => {
      try {
        const response = await fetch("http://localhost:8080/admin/list", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch API list");
        }

        const data = await response.json();
        console.log("Fetched data:", data);
        setAllApis(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllApis();
  }, []);

  useEffect(() => {
    if (allApis.length > 0) {
      const filteredApis = allApis.filter((api) => api.name === apiName);
      setApiDetails(filteredApis);

      // Initialize expanded state for all endpoints
      const initialExpandedState = {};
      filteredApis.forEach((api, index) => {
        initialExpandedState[index] = true; // Expand all by default
      });
      setExpandedApis(initialExpandedState);
    }
  }, [apiName, allApis]);

  const toggleApiExpansion = (index) => {
    setExpandedApis((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: "bg-emerald-500",
      POST: "bg-blue-500",
      PUT: "bg-yellow-500",
      DELETE: "bg-red-500",
      PATCH: "bg-purple-500",
    };
    return colors[method] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-pulse text-slate-700">Loading API Documentation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  if (apiDetails.length === 0) {
    return (
      <div className="text-slate-600 text-center p-4 bg-slate-50 rounded-lg">
        No API documentation available for "{apiName}"
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            API Documentation: {apiName}
          </h1>
          <p className="text-slate-600 mt-2">
            {apiDetails[0].endUris.length} endpoint
            {apiDetails[0].endUris.length !== 1 ? "s" : ""} available
          </p>
        </div>
  
        <div className="space-y-6">
          {apiDetails[0].endUris.map((endpoint, index) => (
            <div
              key={endpoint.id}
              className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
            >
              <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-50"
                onClick={() => toggleApiExpansion(index)}
              >
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getMethodColor(
                      endpoint.method
                    )}`}
                  >
                    {endpoint.method}
                  </span>
                  <span className="font-mono text-sm text-slate-700">
                    {endpoint.endUri}
                  </span>
                </div>
                {expandedApis[index] ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
  
              {expandedApis[index] && (
                <div className="px-6 py-4 border-t border-slate-100">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-slate-700">Base URL</h3>
                      <div className="mt-1 flex items-center space-x-2">
                        <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">
                          {apiDetails[0].baseUri}
                        </code>
                        <button
                          onClick={() => copyToClipboard(apiDetails[0].baseUri)}
                          className="p-1 hover:bg-slate-100 rounded"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4 text-slate-500" />
                        </button>
                      </div>
                    </div>
  
                    <div>
                      <h3 className="text-sm font-medium text-slate-700">Full URL</h3>
                      <div className="mt-1 flex items-center space-x-2">
                        <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">
                          {apiDetails[0].baseUri + endpoint.endUri}
                        </code>
                        <button
                          onClick={() => copyToClipboard(apiDetails[0].baseUri + endpoint.endUri)}
                          className="p-1 hover:bg-slate-100 rounded"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4 text-slate-500" />
                        </button>
                        <a
                          href={apiDetails[0].baseUri + endpoint.endUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 hover:bg-slate-100 rounded"
                          title="Open in new tab"
                        >
                          <ExternalLink className="w-4 h-4 text-slate-500" />
                        </a>
                      </div>
                    </div>
  
                    <div>
                      <h3 className="text-sm font-medium text-slate-700">Headers</h3>
                      <div className="mt-2 overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Header
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Value
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-200">
                            {Object.entries(endpoint.headers || {}).map(
                              ([key, value], idx) => (
                                <tr key={idx}>
                                  <td className="px-4 py-2 text-sm font-mono text-slate-600">
                                    {key}
                                  </td>
                                  <td className="px-4 py-2 text-sm font-mono text-slate-600">
                                    {value}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
  
                    {endpoint.bodyContent && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-700">Body Content</h3>
                        <div className="mt-1 text-sm font-mono text-slate-600">
                          <pre>{endpoint.bodyContent}</pre>
                        </div>
                      </div>
                    )}
  
                    {endpoint.bodyType && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-700">Body Type</h3>
                        <div className="mt-1 text-sm font-mono text-slate-600">
                          {endpoint.bodyType}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}  
export default ApiDetails;
