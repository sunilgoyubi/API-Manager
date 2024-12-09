import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineMail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignUp = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // For error handling

  const handleLogin = () => {
    navigate('/');
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(null); // Reset error state

    try {
      const response = await fetch('http://localhost:8080/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Sending email and password
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      

      // Navigate to a different page after successful signup
      navigate('/'); // Replace with your desired route
    } catch (err) {
      setError(err.message); // Display error message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg min-w-[350px] mx-auto text-center p-6 border border-gray-300 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">Sign-up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-left text-gray-700 mb-2">
              Email:
            </label>
            <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-[#1E2737]">
              <MdOutlineMail className="w-5 h-5 ml-2" />
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-[#1E2737]">
              <RiLockPasswordLine className="w-5 h-5 ml-2" />
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            className="w-full py-2 bg-[#FD7149] text-white rounded-md hover:bg-[#e76743] transition"
          >
            Signup
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6">
          <span className="text-gray-600">Already have an account? </span>
          <button
            onClick={handleLogin}
            className="text-[#FD7149] hover:underline transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
