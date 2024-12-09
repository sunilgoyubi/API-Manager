import React, { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { FaTrashAlt } from "react-icons/fa";


const Admin = () => {
  const [apiData, setApiData] = useState({
    name: "",
    baseUrl: "",
    endpoints: [
      {
        expanded: true,
        endpoint: "",
        method: "GET",
        bodyType: "",
        bodyContent: "",
        headers: [],
        params: [],
        formData: [],
        files: [] ,
        contentType: "application/json",
      },
    ],
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleMainFieldChange = (field, value) => {
    setApiData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEndpointChange = (index, field, value) => {
    setApiData((prev) => ({
      ...prev,
      endpoints: prev.endpoints.map((endpoint, i) =>
        i === index ? { ...endpoint, [field]: value } : endpoint
      ),
    }));
  };

  const handleHeaderChange = (endpointIndex, headerIndex, field, value) => {
    setApiData((prev) => ({
      ...prev,
      endpoints: prev.endpoints.map((endpoint, i) => {
        if (i === endpointIndex) {
          const newHeaders = [...endpoint.headers];
          newHeaders[headerIndex] = {
            ...newHeaders[headerIndex],
            [field]: value,
          };
          return { ...endpoint, headers: newHeaders };
        }
        return endpoint;
      }),
    }));
  };

  const addHeader = (endpointIndex) => {
    setApiData((prev) => ({
      ...prev,
      endpoints: prev.endpoints.map((endpoint, i) =>
        i === endpointIndex
          ? { ...endpoint, headers: [...endpoint.headers, { key: "", value: "" }] }
          : endpoint
      ),
    }));
  };

  const addEndpoint = () => {
    setApiData((prev) => ({
      ...prev,
      endpoints: [
        ...prev.endpoints,
        {
          expanded: true,
          endpoint: "",
          method: "GET",
          bodyType: "",
          bodyContent: "",
          headers: [],
          params: [],
          formData: [],
          files: [] ,
          contentType: "application/json",
        },
      ],
    }));
  };

  const removeEndpoint = (index) => {
    setApiData((prev) => ({
      ...prev,
      endpoints: prev.endpoints.filter((_, i) => i !== index),
    }));
  };

  const toggleEndpoint = (index) => {
    setApiData((prev) => ({
      ...prev,
      endpoints: prev.endpoints.map((endpoint, i) =>
        i === index ? { ...endpoint, expanded: !endpoint.expanded } : endpoint
      ),
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
  
    // Validate the form data before sending
    if (!apiData.name || !apiData.baseUrl) {
      setError("API Name and Base URL are required.");
      return;
    }
  
    try {
      // Prepare the payload with the correct structure
      const payload = {
        name: apiData.name,
        baseUri: apiData.baseUrl,
        endUris: apiData.endpoints.map(({ expanded, ...endpoint }) => ({
          endUri: endpoint.endpoint,
          method: endpoint.method,
          headers: endpoint.headers.reduce((acc, header) => {
            if (header.key && header.value) {
              acc[header.key] = header.value;
            }
            return acc;
          }, {}),
          bodyType: endpoint.bodyType || null,
          contentType: endpoint.contentType || "application/json",
          bodyContent: endpoint.bodyContent || null,
        }))
      };
  
      console.log("Payload being sent:", payload);
  
      const response = await fetch("http://localhost:8080/admin/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create API.");
      }
  
      setSuccessMessage("API successfully created!");
    } catch (err) {
      setError(err.message || "An error occurred while creating the API.");
    }
  };
  
  // params handle
  const handleParamChange = (endpointIndex, paramIndex, field, value) => {
    const updatedEndpoints = [...apiData.endpoints];
    const updatedParams = [...updatedEndpoints[endpointIndex].params];
    updatedParams[paramIndex][field] = value;
  
    updatedEndpoints[endpointIndex].params = updatedParams;
    setApiData((prev) => ({ ...prev, endpoints: updatedEndpoints }));
  };
  
  
  // Function to add a new param
  const addParam = (endpointIndex) => {
    const updatedEndpoints = [...apiData.endpoints];
    updatedEndpoints[endpointIndex].params.push({ key: "", value: "" });
  
    setApiData((prev) => ({ ...prev, endpoints: updatedEndpoints }));
  };
  
  const handleFormChange = (index, fieldType, i, field, value) => {
    setApiData((prev) => {
      const updatedEndpoints = [...prev.endpoints];
      const updatedFieldArray = [...updatedEndpoints[index][fieldType]];
      updatedFieldArray[i] = { ...updatedFieldArray[i], [field]: value };
      updatedEndpoints[index][fieldType] = updatedFieldArray;
      return { ...prev, endpoints: updatedEndpoints };
    });
  };
  
  const handleAddFormField = (index, type) => {
    setApiData((prevData) => {
      const updatedEndpoints = [...prevData.endpoints];
      if (type === "formData") {
        updatedEndpoints[index] = {
          ...updatedEndpoints[index],
          formData: [...updatedEndpoints[index].formData, { key: "", value: "" }],
        };
      } else if (type === "files") {
        updatedEndpoints[index] = {
          ...updatedEndpoints[index],
          files: [...updatedEndpoints[index].files, { key: "", file: null }],
        };
      }
      return { ...prevData, endpoints: updatedEndpoints };
    });
  };
  
  
  
  
  // Function to handle removing a form field
  const handleRemoveFormField = (index, type, fieldIndex) => {
    setApiData((prevData) => {
      const updatedEndpoints = [...prevData.endpoints];
      if (type === 'formData') {
        updatedEndpoints[index].formData.splice(fieldIndex, 1);
      } else if (type === 'files') {
        updatedEndpoints[index].files.splice(fieldIndex, 1);
      }
      return { endpoints: updatedEndpoints };
    });
  };
  

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">API Manager</h1>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}
        {successMessage && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                API Name
              </label>
              <input
                type="text"
                value={apiData.name}
                onChange={(e) => handleMainFieldChange("name", e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E2737] focus:border-[#1E2737]"
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
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E2737] focus:border-[#1E2737]"
                placeholder="https://example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
  <div className="flex justify-between items-center">
    <h2 className="text-lg font-semibold text-slate-900">Endpoints</h2>
    <button
      type="button"
      onClick={addEndpoint}
      className="flex items-center gap-2 bg-[#FD7149] text-white px-4 py-2 rounded-lg hover:bg-[#e76743] transition"
    >
      <Plus className="w-5 h-5" />
      Add Endpoint
    </button>
  </div>

  {apiData.endpoints.map((endpoint, index) => (
    <div
      key={index}
      className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-600">
            Endpoint {index + 1}
          </span>
          <button
            type="button"
            onClick={() => toggleEndpoint(index)}
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
            onClick={() => removeEndpoint(index)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {endpoint.expanded && (
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Endpoint Path
            </label>
            <input
              type="text"
              value={endpoint.endpoint}
              onChange={(e) =>
                handleEndpointChange(index, "endpoint", e.target.value)
              }
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E2737] focus:border-[#1E2737]"
              placeholder="/api/v1/resource"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              HTTP Method
            </label>
            <select
              value={endpoint.method}
              onChange={(e) =>
                handleEndpointChange(index, "method", e.target.value)
              }
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E2737] focus:border-[#1E2737]"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <div>
  <label className="block text-sm font-medium text-slate-700 mb-1">
    Body Type
  </label>
  <select
    value={endpoint.bodyType}
    onChange={(e) =>
      handleEndpointChange(index, "bodyType", e.target.value)
    }
    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E2737] focus:border-[#1E2737]"
  >
    <option value="">Select Body Type</option>
    <option value="raw">Raw</option>
    <option value="form">Form</option>
  </select>
</div>

{/* Conditional rendering based on the Body Type */}
{endpoint.bodyType === 'raw' && (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      Body Content (Raw)
    </label>
    <textarea
      value={endpoint.bodyContent}
      onChange={(e) =>
        handleEndpointChange(index, "bodyContent", e.target.value)
      }
      className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E2737] focus:border-[#1E2737]"
      placeholder="Enter raw body content"
    />
  </div>
)}

{endpoint.bodyType === 'form' && (
  <div className="space-y-4 flex flex-col">
    {/* Form Data Key-Value Pairs */}
    {endpoint.formData.map((formField, fieldIndex) => (
      <div key={fieldIndex} className="flex space-x-4 mb-4">
        <div className="w-full">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Form Key
          </label>
          <input
            type="text"
            value={formField.key}
            onChange={(e) =>
              handleFormChange(index, "formData", fieldIndex, "key", e.target.value)
            }
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E2737] focus:border-[#1E2737]"
            placeholder="Form Key"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Form Value
          </label>
          <input
            type="text"
            value={formField.value}
            onChange={(e) =>
              handleFormChange(index, "formData", fieldIndex, "value", e.target.value)
            }
            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E2737] focus:border-[#1E2737]"
            placeholder="Form Value"
          />
        </div>

        <button
          type="button"
          onClick={() => handleRemoveFormField(index, "formData", fieldIndex)}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrashAlt className="w-5 h-5" />
        </button>
      </div>
    ))}

   

    {/* File Upload Section */}
{endpoint.files.map((fileField, fileIndex) => (
  <div key={fileIndex} className="flex space-x-4 mb-4">
    {/* Key Input for File */}
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        File Key
      </label>
      <input
        type="text"
        value={fileField.key || ""}
        onChange={(e) =>
          handleFormChange(index, "files", fileIndex, "key", e.target.value)
        }
        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E2737] focus:border-[#1E2737]"
        placeholder="File Key"
      />
    </div>

    {/* File Input */}
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        File Upload
      </label>
      <input
        type="file"
        onChange={(e) =>
          handleFormChange(index, "files", fileIndex, "file", e.target.files[0])
        }
        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E2737] focus:border-[#1E2737]"
      />
    </div>

    {/* Remove File Button */}
    <button
      type="button"
      onClick={() => handleRemoveFormField(index, "files", fileIndex)}
      className="text-red-500 hover:text-red-700"
    >
      <FaTrashAlt className="w-5 h-5" />
    </button>
  </div>
))}

      <div className="flex gap-5">
      <button
      type="button"
      onClick={() => handleAddFormField(index, "formData")}
      className="bg-[#FD7149] text-white px-4 py-2 rounded-lg hover:bg-[#e76743] transition  "
    >
      Add Text
    </button>
    <button
      type="button"
      onClick={() => handleAddFormField(index, "files")}
      className="bg-[#FD7149] text-white px-4 py-2 rounded-lg hover:bg-[#e76743] transition "
    >
      Add File
    </button>
      </div>
   
  </div>
)}



           <div className="flex flex-col items-start gap-3">
            {/* Header Fields */}
          {endpoint.headers.map((header, headerIndex) => (
            <div key={headerIndex} className="flex space-x-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Header Key
                </label>
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) =>
                    handleHeaderChange(index, headerIndex, "key", e.target.value)
                  }
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E2737] focus:border-[#1E2737]"
                  placeholder="Header key"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Header Value
                </label>
                <input
                  type="text"
                  value={header.value}
                  onChange={(e) =>
                    handleHeaderChange(index, headerIndex, "value", e.target.value)
                  }
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E2737] focus:border-[#1E2737]"
                  placeholder="Header value"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addHeader(index)}
            className="bg-[#FD7149] text-white px-4 py-2 rounded-lg hover:bg-[#e76743] transition"
          >
            Add Header
          </button>

          {/* Params Section */}
          {endpoint.params.map((param, paramIndex) => (
            <div key={paramIndex} className="flex space-x-4 mb-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Param Key
                </label>
                <input
                  type="text"
                  value={param.key}
                  onChange={(e) =>
                    handleParamChange(index, paramIndex, "key", e.target.value)
                  }
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E2737] focus:border-[#1E2737]"
                  placeholder="Param key"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Param Value
                </label>
                <input
                  type="text"
                  value={param.value}
                  onChange={(e) =>
                    handleParamChange(index, paramIndex, "value", e.target.value)
                  }
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#1E2737] focus:border-[#1E2737]"
                  placeholder="Param value"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addParam(index)}
            className="bg-[#FD7149] text-white px-4 py-2 rounded-lg hover:bg-[#e76743] transition"
          >
            Add Param
          </button>
           </div>
          
        </div>
      )}
    </div>
  ))}
</div>


          <div className="flex justify-center items-center mt-8">
            <button
              type="submit"
              className="w-full bg-[#FD7149] text-white py-3 rounded-md hover:bg-[#e76743] transition"
            >
              Submit API Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;
