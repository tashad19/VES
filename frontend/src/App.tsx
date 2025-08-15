// src/App.tsx
import React, { useState, useEffect } from "react";
import { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import {
  Theme,
  Page,
  ExperimentContent,
  RoadmapNode,
  Section,
  Experiment,
} from "./types";
import MainNavbar from "./components/MainNavbar";
import HomePage from "./pages/HomePage";
import ExperimentsPage from "./pages/ExperimentsPage";
import RoadmapPage from "./pages/RoadmapPage";
import EditorPage from "./pages/EditorPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Footer from "./components/Footer";
import NotificationModal from "./components/NotificationModal";
import ContactModal from "./components/ContactModal";
import axios from "axios";

function App() {
  interface Experiment {
    id: string;
    title: string;
    content: ExperimentContent;
    quizVersion: number;
  }

  const [prompt, setPrompt] = useState("");
  const [activeSection, setActiveSection] = useState<Section>("aim");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [selectedExperimentId, setSelectedExperimentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) setTheme(savedTheme);
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");

    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const handleLogin = (token: string) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    setCurrentPage("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCurrentPage("home");
    setExperiments([]);
    setSelectedExperimentId(null);
  };

  const handleGenerate = async (experimentId: string, text: string) => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      // Generate quiz from existing endpoint (port 5001)
      const quizResponse = await axios.get("https://ves-t89l.onrender.com/generate-mcq", {
        params: { topic: text },
      });
      const quizData = quizResponse.data.error
        ? { totalQuestions: 0, questions: [] }
        : quizResponse.data;

      // Generate aim, introduction, and article from new endpoint (port 5003)
      const contentResponse = await axios.get("https://ves-t89l.onrender.com/generate-experiment", {
        params: { text: text },
      });
      const { aim, introduction, article } = contentResponse.data;

      // Set initial state with "Generating video..." placeholder for illustration
      setExperiments((prev) =>
        prev.map((exp) =>
          exp.id === experimentId
            ? {
                ...exp,
                content: {
                  ...exp.content,
                  quiz: quizData,
                  aim: aim || "",
                  introduction: introduction || "",
                  article: article || "",
                  illustration: "Generating video...", // Temporary placeholder
                },
                quizVersion: (exp.quizVersion || 0) + 1,
              }
            : exp
        )
      );

      // Simulate video generation with 8-second delay
      setTimeout(() => {
        setExperiments((prev) =>
          prev.map((exp) =>
            exp.id === experimentId
              ? {
                  ...exp,
                  content: {
                    ...exp.content,
                    illustration: "/src/manim_video.mp4", // Replace with your actual video path
                  },
                }
              : exp
          )
        );
      }, 30000); // 30 seconds
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = (
    experimentId: string,
    section: Section,
    newContent: string | ExperimentContent["quiz"]
  ) =>
    setExperiments((prev) =>
      prev.map((exp) =>
        exp.id === experimentId
          ? { ...exp, content: { ...exp.content, [section]: newContent } }
          : exp
      )
    );

  const addExperiment = () => {
    if (!isLoggedIn) return;
    const newId = `exp-${Date.now()}`;
    setExperiments((prev) => [
      ...prev,
      {
        id: newId,
        title: `Experiment ${prev.length + 1}`,
        content: {
          aim: "",
          introduction: "",
          article: "",
          illustration: "",
          quiz: { totalQuestions: 0, questions: [] },
        },
        quizVersion: 0,
      },
    ]);
    setSelectedExperimentId(newId);
    setCurrentPage("editor");
  };

  const updateExperimentTitle = (id: string, newTitle: string) =>
    setExperiments((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, title: newTitle } : exp))
    );

  const fetchAndRenderRoadmap = async () => {
    if (!isLoggedIn || !searchQuery.trim()) return;
    setIsLoading(true);
    try {
      console.log("Fetching roadmap for:", searchQuery);
    } catch (error) {
      console.error("Error fetching roadmap:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            theme={theme}
            setCurrentPage={setCurrentPage}
            addExperiment={addExperiment}
            isLoggedIn={isLoggedIn}
          />
        );
      case "experiments":
        return (
          <ExperimentsPage
            theme={theme}
            experiments={experiments}
            setCurrentPage={setCurrentPage}
            addExperiment={addExperiment}
            setSelectedExperimentId={setSelectedExperimentId}
            updateExperimentTitle={updateExperimentTitle}
            isLoggedIn={isLoggedIn}
          />
        );
      case "roadmap":
        return (
          <RoadmapPage
            theme={theme}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            nodes={nodes}
            edges={edges}
            isLoading={isLoading}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            fetchAndRenderRoadmap={fetchAndRenderRoadmap}
            isLoggedIn={isLoggedIn}
          />
        );
      case "login":
        return (
          <LoginPage
            theme={theme}
            onLogin={handleLogin}
            setCurrentPage={setCurrentPage}
          />
        );
      case "signup":
        return <SignupPage theme={theme} setCurrentPage={setCurrentPage} />;
      case "editor":
        if (!isLoggedIn) {
          setCurrentPage("login");
          return null;
        }
        if (!selectedExperimentId || !experiments.find((exp) => exp.id === selectedExperimentId))
          return null;
        const selectedExperiment = experiments.find((exp) => exp.id === selectedExperimentId)!;
        return (
          <EditorPage
            theme={theme}
            prompt={prompt}
            setPrompt={setPrompt}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isPreviewMode={isPreviewMode}
            setIsPreviewMode={setIsPreviewMode}
            experimentId={selectedExperimentId}
            content={selectedExperiment.content}
            quizVersion={selectedExperiment.quizVersion}
            handleGenerate={(text) => handleGenerate(selectedExperimentId, text)}
            handleContentChange={handleContentChange}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <MainNavbar
        theme={theme}
        toggleTheme={toggleTheme}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        toggleNotifications={() => setShowNotifications(!showNotifications)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <div className="container mx-auto px-4 py-8">{renderPage()}</div>
      <Footer theme={theme} onContactClick={() => setShowContactModal(true)} />
      {showNotifications && (
        <NotificationModal theme={theme} onClose={() => setShowNotifications(false)} />
      )}
      {showContactModal && (
        <ContactModal theme={theme} onClose={() => setShowContactModal(false)} />
      )}
    </div>
  );
}

export default App;