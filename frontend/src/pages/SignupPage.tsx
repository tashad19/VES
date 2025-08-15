// src/components/SignupPage.tsx
import React, { useState } from "react";
import axios from "axios";
import { Theme, Page } from "../types";

interface SignupPageProps {
  theme: Theme;
  setCurrentPage: (page: Page) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ theme, setCurrentPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("https://ves-t89l.onrender.com/api/register", { username, password });
      setSuccess("Registration successful! Please log in.");
      setError("");
      setUsername("");
      setPassword("");
      setTimeout(() => setCurrentPage("login"), 2000); // Redirect to login after 2s
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
      setSuccess("");
    }
  };

  return (
    <div className={`max-w-md mx-auto p-8 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
      <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full p-2 border rounded-md ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
            placeholder="Enter username"
            required
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-2 border rounded-md ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
            placeholder="Enter password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Sign Up
        </button>
        <div className="text-center">
          <button
            onClick={() => setCurrentPage("login")}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Already have an account? Log in
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;