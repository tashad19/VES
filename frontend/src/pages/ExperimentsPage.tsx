// src/components/ExperimentsPage.tsx
import React, { useState } from "react";
import { Image, Pencil } from "lucide-react";
import { Theme, Page, Experiment } from "../types";

interface ExperimentsPageProps {
  theme: Theme;
  experiments: Experiment[];
  setCurrentPage: (page: Page) => void;
  addExperiment: () => void;
  setSelectedExperimentId: (id: string) => void;
  updateExperimentTitle: (id: string, newTitle: string) => void;
  isLoggedIn: boolean;
}

const ExperimentsPage: React.FC<ExperimentsPageProps> = ({
  theme,
  experiments,
  setCurrentPage,
  addExperiment,
  setSelectedExperimentId,
  updateExperimentTitle,
  isLoggedIn,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");

  if (!isLoggedIn) {
    return (
      <div className={`p-8 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
        <h1 className="text-3xl font-bold mb-6">My Experiments</h1>
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Please log in to view and manage your experiments.</p>
        <button
          onClick={() => setCurrentPage("login")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Log In
        </button>
      </div>
    );
  }

  const handleEditClick = (id: string, currentTitle: string) => {
    setEditingId(id);
    setNewTitle(currentTitle);
  };

  const handleTitleSave = (id: string) => {
    if (newTitle.trim()) updateExperimentTitle(id, newTitle.trim());
    setEditingId(null);
  };

  return (
    <div className={`p-8 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Experiments</h1>
        <button
          onClick={addExperiment}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Experiment
        </button>
      </div>
      {experiments.length === 0 ? (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>No experiments yet. Create one to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((experiment) => (
            <div
              key={experiment.id}
              className={`p-6 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}
            >
              <div className="flex items-center justify-between mb-2">
                {editingId === experiment.id ? (
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={() => handleTitleSave(experiment.id)}
                    onKeyPress={(e) => e.key === "Enter" && handleTitleSave(experiment.id)}
                    className={`text-xl font-semibold ${theme === "dark" ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-900"} p-1 rounded`}
                    autoFocus
                  />
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">{experiment.title}</h2>
                    <button onClick={() => handleEditClick(experiment.id, experiment.title)}>
                      <Pencil size={16} className="text-blue-500 hover:text-blue-600" />
                    </button>
                  </>
                )}
              </div>
              <p className="text-sm mb-4">Last edited: {new Date().toLocaleDateString()}</p>
              <div
                className={`h-40 mb-4 rounded-md ${theme === "dark" ? "bg-gray-600" : "bg-gray-200"} flex items-center justify-center`}
              >
                <Image size={48} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Physics</span>
                <button
                  onClick={() => {
                    setSelectedExperimentId(experiment.id);
                    setCurrentPage("editor");
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperimentsPage;