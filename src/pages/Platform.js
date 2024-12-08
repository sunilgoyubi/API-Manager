import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const Platform = () => {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch APIs from the backend
  useEffect(() => {
    const fetchApis = async () => {
      try {
        const response = await fetch("http://localhost:8080/admin/list", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add token for authentication
          },
        });
       
        if (!response.ok) {
          throw new Error("Failed to fetch API data");
        }

        const data = await response.json();
        console.log("response", data);
        setApis(data); // Store the fetched API data
      } catch (err) {
        setError(err.message); // Set error message if fetching fails
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchApis(); // Call the fetchApis function on mount
  }, []);

  // Group APIs by name
  const groupedApis = apis.reduce((acc, api) => {
    if (!acc[api.name]) {
      acc[api.name] = [];
    }
    acc[api.name].push(api);
    return acc;
  }, {});

  const handleCardClick = (apiName) => {
    // Navigate to the new page with the API name as a URL parameter
    navigate(`/api-details/${apiName}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg font-medium">Loading APIs...</p>
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

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Platform APIs</h1>
      {Object.keys(groupedApis).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedApis).map(([apiName, apiList], index) => (
            <div
              key={index}
              className="cursor-pointer bg-white p-6 rounded-lg shadow-md hover:shadow-lg"
              onClick={() => handleCardClick(apiName)} // Trigger card click to navigate
            >
              <h2 className="text-xl font-semibold text-gray-700">{apiName}</h2>
              <p className="text-gray-500">{apiList[0].baseUri}</p> {/* Display the base URL of the first API */}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700 text-lg font-medium">
          No APIs available. Please add APIs through the Admin page.
        </p>
      )}
    </div>
  );
};

export default Platform;
