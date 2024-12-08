import React, { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const Admin = () => {
  const [apiData, setApiData] = useState({
    name: "",
    baseUrl: "",
    endpoints: [
      {
        id: Date.now(),
        expanded: true,
        endpoint: "",
        method: "GET",
        bodyType: "",
        bodyContent: "",
        headers: [],
        contentType: "application/json",
      }
    ]
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleMainFieldChange = (field, value) => {
    setApiData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEndpointChange = (id, field, value) => {
    setApiData(prev => ({
      ...prev,
      endpoints: prev.endpoints.map(endpoint =>
        endpoint.id === id ? { ...endpoint, [field]: value } : endpoint
      )
    }));
  };

  const handleHeaderChange = (endpointId, headerIndex, field, value) => {
    setApiData(prev => ({
      ...prev,
      endpoints: prev.endpoints.map(endpoint => {
        if (endpoint.id === endpointId) {
          const newHeaders = [...endpoint.headers];
          newHeaders[headerIndex] = { ...newHeaders[headerIndex], [field]: value };
          return { ...endpoint, headers: newHeaders };
        }
        return endpoint;
      })
    }));
  };

  const addHeader = (endpointId) => {
    setApiData(prev => ({
      ...prev,
      endpoints: prev.endpoints.map(endpoint =>
        endpoint.id === endpointId
          ? { ...endpoint, headers: [...endpoint.headers, { key: "", value: "" }] }
          : endpoint
      )
    }));
  };

  const addEndpoint = () => {
    setApiData(prev => ({
      ...prev,
      endpoints: [
        ...prev.endpoints,
        {
          id: Date.now(),
          expanded: true,
          endpoint: "",
          method: "GET",
          bodyType: "",
          bodyContent: "",
          headers: [],
          contentType: "application/json",
        }
      ]
    }));
  };

  const removeEndpoint = (id) => {
    setApiData(prev => ({
      ...prev,
      endpoints: prev.endpoints.filter(endpoint => endpoint.id !== id)
    }));
  };

  const toggleEndpoint = (id) => {
    setApiData(prev => ({
      ...prev,
      endpoints: prev.endpoints.map(endpoint =>
        endpoint.id === id ? { ...endpoint, expanded: !endpoint.expanded } : endpoint
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Unauthorized: No token found. Please login first.");
      return;
    }

    try {
      const responses = await Promise.all(
        apiData.endpoints.map(endpoint => {
          const payload = {
            name: apiData.name,
            baseUrl: apiData.baseUrl,
            endpoint: endpoint.endpoint,
            method: endpoint.method,
            headers: endpoint.headers.reduce((acc, header) => {
              if (header.key && header.value) {
                acc[header.key] = header.value;
              }
              return acc;
            }, {}),
            bodyType: endpoint.bodyType,
            bodyContent: endpoint.bodyContent,
            contentType: endpoint.contentType,
          };

          return fetch("http://localhost:8080/admin/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
        })
      );

      const hasError = responses.some(response => !response.ok);
      if (hasError) {
        throw new Error("Failed to create one or more APIs.");
      }

      setSuccessMessage("All APIs successfully created!");
    } catch (err) {
      setError(err.message || "An error occurred while creating the APIs.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">API Manager</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>
        )}
        {successMessage && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common Fields */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                API Name
              </label>
              <input
                type="text"
                value={apiData.name}
                onChange={(e) => handleMainFieldChange("name", e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter API name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Base URL
              </label>
              <input
                type="text"
                value={apiData.baseUrl}
                onChange={(e) => handleMainFieldChange("baseUrl", e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
                required
              />
            </div>
          </div>

          {/* Endpoints Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900">Endpoints</h2>
              <button
                type="button"
                onClick={addEndpoint}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                <Plus className="w-5 h-5" />
                Add Endpoint
              </button>
            </div>

            {apiData.endpoints.map((endpoint, index) => (
              <div
                key={endpoint.id}
                className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-600">
                      Endpoint {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleEndpoint(endpoint.id)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      {endpoint.expanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {apiData.endpoints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEndpoint(endpoint.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {endpoint.expanded && (
                  <div className="p-6 space-y-6">
                    {/* Endpoint Path */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Endpoint Path
                      </label>
                      <input
                        type="text"
                        value={endpoint.endpoint}
                        onChange={(e) =>
                          handleEndpointChange(endpoint.id, "endpoint", e.target.value)
                        }
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="/api/v1/resource"
                        required
                      />
                    </div>

                    {/* Method */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Method
                      </label>
                      <select
                        value={endpoint.method}
                        onChange={(e) =>
                          handleEndpointChange(endpoint.id, "method", e.target.value)
                        }
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </div>

                    {/* Headers */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Headers
                      </label>
                      {endpoint.headers.map((header, headerIndex) => (
                        <div key={headerIndex} className="flex gap-4 mb-2">
                          <input
                            type="text"
                            value={header.key}
                            onChange={(e) =>
                              handleHeaderChange(
                                endpoint.id,
                                headerIndex,
                                "key",
                                e.target.value
                              )
                            }
                            className="w-1/2 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Header Key"
                          />
                          <input
                            type="text"
                            value={header.value}
                            onChange={(e) =>
                              handleHeaderChange(
                                endpoint.id,
                                headerIndex,
                                "value",
                                e.target.value
                              )
                            }
                            className="w-1/2 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Header Value"
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addHeader(endpoint.id)}
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                      >
                        + Add Header
                      </button>
                    </div>

                    {/* Body Type and Content */}
                    {(endpoint.method === "POST" || endpoint.method === "PUT") && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Content Type
                          </label>
                          <select
                            value={endpoint.contentType}
                            onChange={(e) =>
                              handleEndpointChange(
                                endpoint.id,
                                "contentType",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="application/json">application/json</option>
                            <option value="application/x-www-form-urlencoded">
                              application/x-www-form-urlencoded
                            </option>
                            <option value="multipart/form-data">
                              multipart/form-data
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Body Type
                          </label>
                          <select
                            value={endpoint.bodyType}
                            onChange={(e) =>
                              handleEndpointChange(
                                endpoint.id,
                                "bodyType",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Body Type</option>
                            <option value="raw">Raw</option>
                            <option value="form">Form</option>
                          </select>
                        </div>

                        {endpoint.bodyType && (
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                              Body Content
                            </label>
                            <textarea
                              value={endpoint.bodyContent}
                              onChange={(e) =>
                                handleEndpointChange(
                                  endpoint.id,
                                  "bodyContent",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              rows="4"
                              placeholder="Enter JSON or key-value pairs"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Generate APIs
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;