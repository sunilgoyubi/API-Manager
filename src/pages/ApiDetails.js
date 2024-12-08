import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ApiDetails = () => {
  const { apiName } = useParams(); // Get the API name from the URL parameter
  const [allApis, setAllApis] = useState([]);
  const [apiDetails, setApiDetails] = useState([]); // Set to array to store multiple APIs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the list of all APIs
  useEffect(() => {
    const fetchAllApis = async () => {
      try {
        const response = await fetch("http://localhost:8080/admin/list", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add token for authentication
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch API list");
        }

        const data = await response.json();
        setAllApis(data); // Store the list of all APIs
      } catch (err) {
        setError(err.message); // Set error message if fetching fails
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchAllApis(); // Call the fetchAllApis function on mount
  }, []);

  // Filter the selected API based on apiName from URL
  useEffect(() => {
    if (allApis.length > 0) {
      // Filter all APIs with the same name
      const filteredApis = allApis.filter((api) => api.name === apiName);
      setApiDetails(filteredApis); // Set the API details with all matching APIs
    }
  }, [apiName, allApis]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg font-medium">Loading API Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-red-600 text-lg font-medium">Error: {error}</p>
      </div>
    );
  }

  if (apiDetails.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg font-medium">No details available for this API.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">
        {apiDetails.length} APIs found with the name "{apiName}".
      </h1>
      
      {apiDetails.map((api, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mb-6">
          <h2 className="text-xl font-semibold">Base URL: {api.baseUri}</h2>
          <table className="w-full border-collapse mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left p-2">Endpoint</th>
                <th className="text-left p-2">Full URL</th>
                <th className="text-left p-2">Method</th>
                <th className="text-left p-2">Headers</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white hover:bg-gray-200">
                <td className="p-2">{api.endUri}</td>
                <td className="p-2">{api.baseUri + api.endUri}</td>
                <td className="p-2">
                  <span
                    className={`py-1 px-3 rounded-lg text-white ${
                      api.method === "GET"
                        ? "bg-green-500"
                        : api.method === "POST"
                        ? "bg-blue-500"
                        : api.method === "PUT"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {api.method}
                  </span>
                </td>
                <td className="p-2">
                  <ul>
                    {Object.entries(api.headers).map(([key, value], idx) => (
                      <li key={idx}>
                        <strong>{key}:</strong> {value}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ApiDetails;
