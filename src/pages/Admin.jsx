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
    headers: [], // Array to store headers
    contentType: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApiStructure((prev) => ({ ...prev, [name]: value }));
  };

  const handleHeaderChange = (e, index) => {
    const { name, value } = e.target;
    const newHeaders = [...apiStructure.headers];
    newHeaders[index] = { ...newHeaders[index], [name]: value };
    setApiStructure((prev) => ({ ...prev, headers: newHeaders }));
  };

  const addHeader = () => {
    setApiStructure((prev) => ({
      ...prev,
      headers: [...prev.headers, { key: "", value: "" }],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Generated API Structure:", apiStructure);
    alert("API Structure generated! Check the console for details.");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full  bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-700 text-center">API Manager</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-600  font-medium">Name</label>
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

          <div className="flex w-full gap-6">
             {/* Base URL */}
          <div className="w-full">
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
          <div className="w-full">
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
          </div>

         
         

          {/* Route */}
          {/* <div>
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
          </div> */}


           <div className="flex w-full gap-6">
               {/* Method */}
          <div className="w-full">
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

           {/* Headers */}
           <div className="w-full">
            <label className="block text-gray-600 font-medium">Headers</label>
            {apiStructure.headers.map((header, index) => (
              <div key={index} className="flex gap-4 mb-2">
                <input
                  type="text"
                  name="key"
                  value={header.key}
                  onChange={(e) => handleHeaderChange(e, index)}
                  placeholder="Header Key"
                  className="w-1/2 p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                />
                <input
                  type="text"
                  name="value"
                  value={header.value}
                  onChange={(e) => handleHeaderChange(e, index)}
                  placeholder="Header Value"
                  className="w-1/2 p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addHeader}
              className="text-blue-500 hover:underline"
            >
              Add Header
            </button>
          </div>


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

          {/* Content Type */}
          {(apiStructure.method === "POST" || apiStructure.method === "PUT") && (
            <div>
              <label className="block text-gray-600 font-medium">Content-Type</label>
              <select
                name="contentType"
                value={apiStructure.contentType}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                required
              >
                <option value="application/json">application/json</option>
                <option value="application/x-www-form-urlencoded">
                  application/x-www-form-urlencoded
                </option>
                <option value="multipart/form-data">multipart/form-data</option>
              </select>
            </div>
          )}

         

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Generate api
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
