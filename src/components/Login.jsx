import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineMail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

const Login = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false); 

  const handleSignup = () => {
    navigate('/signup');
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg min-w-[350px] mx-auto text-center p-6 border border-gray-300 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>
        <form>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-left text-gray-700 mb-2">
              Email:
            </label>
            <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-blue-500">
              <MdOutlineMail className="w-5 h-5 ml-2" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border-none focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-left text-gray-700 mb-2">
              Password:
            </label>
            <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-blue-500">
              <RiLockPasswordLine className="w-5 h-5 ml-2" />
              <input
                type={passwordVisible ? 'text' : 'password'} 
                id="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border-none focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="mr-2"
              >
                {passwordVisible ? (
                  <FaEyeSlash className="w-5 h-5" />
                ) : (
                  <FaEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6">
          <span className="text-gray-600">Don't have an account? </span>
          <button
            onClick={handleSignup}
            className="text-blue-600 hover:underline transition"
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
