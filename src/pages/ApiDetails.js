import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  ExternalLink, 
  Edit,
  Box,
  Check,
  Globe,
  FileJson,
  Settings,
  Server
} from "lucide-react";

const ApiDetails = () => {
  const { apiName } = useParams();
  const navigate = useNavigate();
  const [allApis, setAllApis] = useState([]);
  const [apiDetails, setApiDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedApis, setExpandedApis] = useState({});
  const [copiedText, setCopiedText] = useState("");

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

        if (!response.ok) throw new Error("Failed to fetch API list");
        const data = await response.json();
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
      const initialExpandedState = {};
      filteredApis.forEach((api, index) => {
        initialExpandedState[index] = true;
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

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(""), 2000);
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

  const getMethodIcon = (method) => {
    switch (method) {
      case 'GET': return <Globe className="w-4 h-4" />;
      case 'POST': return <Box className="w-4 h-4" />;
      case 'PUT': return <Settings className="w-4 h-4" />;
      case 'DELETE': return <Trash2 className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8 p-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-slate-900">
                {apiName}
              </h1>
              <p className="text-slate-600">
                {apiDetails[0]?.endUris.length || 0} endpoint
                {apiDetails[0]?.endUris.length !== 1 ? "s" : ""} available
              </p>
            </div>
            <button
              onClick={() => handleEditClick(apiDetails[0]?.id)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit API
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {apiDetails[0]?.endUris.map((endpoint, index) => (
            <div
              key={endpoint.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group"
            >
              <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => toggleApiExpansion(index)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getMethodColor(endpoint.method)} flex items-center gap-2`}>
                    {getMethodIcon(endpoint.method)}
                    {endpoint.method}
                  </div>
                  <span className="font-mono text-sm text-slate-700">
                    {endpoint.endUri}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {expandedApis[index] ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                  )}
                </div>
              </div>

              {expandedApis[index] && (
                <div className="px-6 py-4 border-t border-slate-100 space-y-6">
                  {/* Base URL */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-slate-700 mb-2">Base URL</h3>
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-2">
                      <code className="text-sm font-mono text-slate-700">
                        {apiDetails[0].baseUri}
                      </code>
                      <button
                        onClick={() => copyToClipboard(apiDetails[0].baseUri, "baseUrl")}
                        className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                        title="Copy to clipboard"
                      >
                        {copiedText === "baseUrl" ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Full URL */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-slate-700 mb-2">Full URL</h3>
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-2">
                      <code className="text-sm font-mono text-slate-700">
                        {apiDetails[0].baseUri + endpoint.endUri}
                      </code>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyToClipboard(apiDetails[0].baseUri + endpoint.endUri, "fullUrl")}
                          className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                          title="Copy to clipboard"
                        >
                          {copiedText === "fullUrl" ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-500" />
                          )}
                        </button>
                        <a
                          href={apiDetails[0].baseUri + endpoint.endUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                          title="Open in new tab"
                        >
                          <ExternalLink className="w-4 h-4 text-slate-500" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Headers */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-slate-700 mb-2">Headers</h3>
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
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
                        <tbody className="divide-y divide-slate-200">
                          {Object.entries(endpoint.headers || {}).map(([key, value], idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="px-4 py-2 text-sm font-mono text-slate-600">
                                {key}
                              </td>
                              <td className="px-4 py-2 text-sm font-mono text-slate-600">
                                {value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Body Content */}
                  {endpoint.bodyContent && (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileJson className="w-4 h-4 text-slate-700" />
                        <h3 className="text-sm font-medium text-slate-700">Body Content</h3>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-lg p-4">
                        <pre className="text-sm font-mono text-slate-600 whitespace-pre-wrap">
                          {endpoint.bodyContent}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Body Type */}
                  {endpoint.bodyType && (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-slate-700 mb-2">Body Type</h3>
                      <div className="bg-white border border-slate-200 rounded-lg px-4 py-2">
                        <code className="text-sm font-mono text-slate-600">
                          {endpoint.bodyType}
                        </code>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiDetails;