import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditApiPage = () => {
  const { id } = useParams(); // Use the `id` from the URL to identify the API
  const navigate = useNavigate();
  const [apiDetails, setApiDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    baseUri: "",
    endUris: [],
  });

  // Fetch API details by ID
  useEffect(() => {
    const fetchApiDetails = async () => {
      const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage

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
            Authorization: `Bearer ${token}`, // Send token for authorization
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

  const handleAddEndpoint = () => {
    const newEndpoint = {
      endUri: "",
      method: "",
      bodyContent: "",
      bodyType: "",
    };
    setFormData((prevData) => ({
      ...prevData,
      endUris: [...prevData.endUris, newEndpoint],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken"); // Retrieve the token for PUT request

    if (!token) {
      setError("Unauthorized. Please login.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/admin/update/${id}`, {
        method: "PUT", // Using PUT for updating the API
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token for authorization
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update API");
      }

      // Navigate back to the API details page after successful update
      navigate(`/platform`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Edit API: {apiDetails.name}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              API Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="baseUri" className="block text-sm font-medium text-slate-700">
              Base URI
            </label>
            <input
              type="text"
              id="baseUri"
              name="baseUri"
              value={formData.baseUri}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full"
              required
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-700">Endpoints</h3>
            {formData.endUris.map((endpoint, index) => (
              <div key={index} className="border rounded-md p-4 mb-4">
                <div>
                  <label htmlFor={`endUri-${index}`} className="block text-sm font-medium text-slate-700">
                    Endpoint URI
                  </label>
                  <input
                    type="text"
                    id={`endUri-${index}`}
                    name="endUri"
                    value={endpoint.endUri}
                    onChange={(e) => handleEndpointChange(index, e)}
                    className="mt-1 p-2 border rounded-md w-full"
                  />
                </div>

                <div>
                  <label htmlFor={`method-${index}`} className="block text-sm font-medium text-slate-700">
                    HTTP Method
                  </label>
                  <input
                    type="text"
                    id={`method-${index}`}
                    name="method"
                    value={endpoint.method}
                    onChange={(e) => handleEndpointChange(index, e)}
                    className="mt-1 p-2 border rounded-md w-full"
                  />
                </div>

                {/* Add Body Content and Body Type fields */}
                <div>
                  <label htmlFor={`bodyContent-${index}`} className="block text-sm font-medium text-slate-700">
                    Body Content
                  </label>
                  <textarea
                    id={`bodyContent-${index}`}
                    name="bodyContent"
                    value={endpoint.bodyContent || ""}
                    onChange={(e) => handleEndpointChange(index, e)}
                    className="mt-1 p-2 border rounded-md w-full"
                    rows="4"
                  />
                </div>

                <div>
                  <label htmlFor={`bodyType-${index}`} className="block text-sm font-medium text-slate-700">
                    Body Type
                  </label>
                  <input
                    type="text"
                    id={`bodyType-${index}`}
                    name="bodyType"
                    value={endpoint.bodyType || ""}
                    onChange={(e) => handleEndpointChange(index, e)}
                    className="mt-1 p-2 border rounded-md w-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <div>
            <button
              type="button"
              onClick={handleAddEndpoint}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Add Endpoint
            </button>
          </div>

          <div>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditApiPage;
