// src/components/HomePage.tsx
import React from "react";
import { Theme, Page } from "../types";

interface HomePageProps {
  theme: Theme;
  setCurrentPage: (page: Page) => void;
  addExperiment: () => void;
  isLoggedIn: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ theme, setCurrentPage, addExperiment, isLoggedIn }) => {
  if (!isLoggedIn) {
    return (
      <div
      className={`min-h-screen flex items-center justify-center relative text-white ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
      style={{
        backgroundImage: 'url("/images/BG_VES.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "inset 0 0 100px rgba(0, 0, 0, 0.9)"
      }}
    >
      <div className="text-center p-8 bg-opacity-70 bg-black rounded-lg">
        <h1 className="text-5xl font-bold mb-4">Welcome to Virtual Experiment Sandbox</h1>
        <p className="text-xl mb-6">Explore, create, and learn with interactive virtual experiments.</p>
        <button
          onClick={() => setCurrentPage("login")}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors text-lg"
        >
          Log In to Get Started
        </button>
      </div>
    </div>
    );
  }

  return (
    <div className={`p-8 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
      <h1 className="text-3xl font-bold mb-6">Welcome to Virtual Experiment Sandbox</h1>
      <p className="mb-4">Create, share, and learn with interactive virtual experiments.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className={`p-6 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
          <h2 className="text-xl font-semibold mb-3">Create New Experiment</h2>
          <p className="mb-4">Start from scratch or use our templates to build your virtual experiment.</p>
          <button
            onClick={addExperiment}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </div>
        <div className={`p-6 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
          <h2 className="text-xl font-semibold mb-3">Explore Experiments</h2>
          <p className="mb-4">Browse through experiments created by our community.</p>
          <button
            onClick={() => setCurrentPage("experiments")}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Explore Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;