import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">API Manager</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* Admin card */}
        <Link to="/admin">
          <div className="bg-blue-600 text-white w-full h-48 flex flex-col items-center justify-center rounded-lg shadow-lg hover:shadow-2xl hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
            <h2 className="text-2xl font-semibold">Admin</h2>
            <p className="mt-2 text-lg">Manage APIs and Users</p>
          </div>
        </Link>

        {/* Platform card */}
        <Link to="/platform">
          <div className="bg-green-600 text-white w-full h-48 flex flex-col items-center justify-center rounded-lg shadow-lg hover:shadow-2xl hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105">
            <h2 className="text-2xl font-semibold">Platform</h2>
            <p className="mt-2 text-lg">Explore APIs</p>
          </div>
        </Link>

      </div>
    </div>
  );
};

export default Home;
