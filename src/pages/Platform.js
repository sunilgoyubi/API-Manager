import React, { useEffect, useState } from "react";

const Platform = () => {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch APIs from the backend
  useEffect(() => {
    const fetchApis = async () => {
      try {
        const response = await fetch("https://your-backend-url.com/apis"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch API data");
        }
        const data = await response.json();
        setApis(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApis();
  }, []);

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
      {apis.length > 0 ? (
        <table className="w-full max-w-4xl bg-white shadow-lg rounded-lg border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Base URL</th>
              <th className="text-left p-4">Endpoint</th>
              <th className="text-left p-4">Route</th>
              <th className="text-left p-4">Method</th>
            </tr>
          </thead>
          <tbody>
            {apis.map((api, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200`}
              >
                <td className="p-4">{api.name}</td>
                <td className="p-4">{api.baseUrl}</td>
                <td className="p-4">{api.endpoint}</td>
                <td className="p-4">{api.route}</td>
                <td className="p-4">
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
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-700 text-lg font-medium">
          No APIs available. Please add APIs through the Admin page.
        </p>
      )}
    </div>
  );
};

export default Platform;
