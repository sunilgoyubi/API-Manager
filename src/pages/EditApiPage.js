import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Trash2, Plus, Save } from "lucide-react";

const EditApiPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apiDetails, setApiDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEndpoints, setExpandedEndpoints] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    baseUri: "",
    endUris: [],
  });

  useEffect(() => {
    const fetchApiDetails = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Unauthorized. Please login.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/admin/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch API details");
        }

        const data = await response.json();
        setApiDetails(data);
        setFormData({
          name: data.name,
          baseUri: data.baseUri,
          endUris: data.endUris || [],
        });
        
        // Initialize all endpoints as expanded
        const initialExpandedState = {};
        (data.endUris || []).forEach((_, index) => {
          initialExpandedState[index] = true;
        });
        setExpandedEndpoints(initialExpandedState);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApiDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEndpointChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEndUris = [...formData.endUris];
    updatedEndUris[index] = {
      ...updatedEndUris[index],
      [name]: value,
    };
    setFormData((prevData) => ({
      ...prevData,
      endUris: updatedEndUris,
    }));
  };

  const toggleEndpoint = (index) => {
    setExpandedEndpoints(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleAddEndpoint = () => {
    const newEndpoint = {
      endUri: "",
      method: "GET",
      bodyContent: "",
      bodyType: "raw",
      contentType: "application/json",
    };
    setFormData((prevData) => ({
      ...prevData,
      endUris: [...prevData.endUris, newEndpoint],
    }));
    // Expand the newly added endpoint
    setExpandedEndpoints(prev => ({
      ...prev,
      [formData.endUris.length]: true
    }));
  };

  const handleDeleteEndpoint = (index) => {
    const updatedEndUris = formData.endUris.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      endUris: updatedEndUris,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Unauthorized. Please login.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/admin/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update API");
      }

      navigate(`/platform`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-pulse text-slate-700">Loading API Details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Edit API</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common Fields */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">API Details</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                API Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Base URI
              </label>
              <input
                type="text"
                name="baseUri"
                value={formData.baseUri}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                onClick={handleAddEndpoint}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                <Plus className="w-5 h-5" />
                Add Endpoint
              </button>
            </div>

            {formData.endUris.map((endpoint, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200 cursor-pointer"
                  onClick={() => toggleEndpoint(index)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-600">
                      Endpoint {index + 1}
                    </span>
                    {expandedEndpoints[index] ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  {formData.endUris.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEndpoint(index);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {expandedEndpoints[index] && (
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Endpoint URI
                      </label>
                      <input
                        type="text"
                        name="endUri"
                        value={endpoint.endUri}
                        onChange={(e) => handleEndpointChange(index, e)}
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="/api/v1/resource"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Method
                      </label>
                      <select
                        name="method"
                        value={endpoint.method}
                        onChange={(e) => handleEndpointChange(index, e)}
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </div>

                    {(endpoint.method === "POST" || endpoint.method === "PUT") && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Body Type
                          </label>
                          <select
                            name="bodyType"
                            value={endpoint.bodyType}
                            onChange={(e) => handleEndpointChange(index, e)}
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="raw">Raw</option>
                            <option value="form">Form</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Content Type
                          </label>
                          <select
                            name="contentType"
                            value={endpoint.contentType}
                            onChange={(e) => handleEndpointChange(index, e)}
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="application/json">application/json</option>
                            <option value="application/x-www-form-urlencoded">
                              application/x-www-form-urlencoded
                            </option>
                            <option value="multipart/form-data">multipart/form-data</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">
                            Body Content
                          </label>
                          <textarea
                            name="bodyContent"
                            value={endpoint.bodyContent}
                            onChange={(e) => handleEndpointChange(index, e)}
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                            placeholder="Enter request body content"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditApiPage;