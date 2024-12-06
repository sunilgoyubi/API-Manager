import React, { useState } from "react";

const Admin = () => {
  const [apiStructure, setApiStructure] = useState({
    name: "",
    baseUrl: "",
    endpoint: "",
    route: "",
    method: "GET",
    bodyType: "",
    bodyContent: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApiStructure((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Generated API Structure:", apiStructure);
    alert("API Structure generated! Check the console for details.");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-700 text-center">API Manager</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-600 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={apiStructure.name}
              onChange={handleInputChange}
              placeholder="Enter API name"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              required
            />
          </div>

          {/* Base URL */}
          <div>
            <label className="block text-gray-600 font-medium">Base URL</label>
            <input
              type="text"
              name="baseUrl"
              value={apiStructure.baseUrl}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              required
            />
          </div>

          {/* Endpoint */}
          <div>
            <label className="block text-gray-600 font-medium">Endpoint</label>
            <input
              type="text"
              name="endpoint"
              value={apiStructure.endpoint}
              onChange={handleInputChange}
              placeholder="/api/v1/resource"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              required
            />
          </div>

          {/* Route */}
          <div>
            <label className="block text-gray-600 font-medium">Route</label>
            <input
              type="text"
              name="route"
              value={apiStructure.route}
              onChange={handleInputChange}
              placeholder="/resource/:id"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              required
            />
          </div>

          {/* Method */}
          <div>
            <label className="block text-gray-600 font-medium">Method</label>
            <select
              name="method"
              value={apiStructure.method}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              required
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          {/* Body Type (Only for POST or PUT) */}
          {(apiStructure.method === "POST" || apiStructure.method === "PUT") && (
            <div>
              <label className="block text-gray-600 font-medium">Body Type</label>
              <select
                name="bodyType"
                value={apiStructure.bodyType}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              >
                <option value="">Select Body Type</option>
                <option value="raw">Raw</option>
                <option value="form">Form</option>
              </select>
            </div>
          )}

          {/* Body Content (Only for Raw/Form) */}
          {(apiStructure.bodyType === "raw" || apiStructure.bodyType === "form") && (
            <div>
              <label className="block text-gray-600 font-medium">Body Content</label>
              <textarea
                name="bodyContent"
                value={apiStructure.bodyContent}
                onChange={handleInputChange}
                placeholder="Enter JSON or key-value pairs"
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                rows="4"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
