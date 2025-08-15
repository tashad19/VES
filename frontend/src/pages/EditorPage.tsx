// src/pages/EditorPage.tsx
import React, { useState } from "react";
import { Play, Save, Lightbulb, BookOpen, FileText, Image, HelpCircle, Upload, X } from "lucide-react";
import { Theme, Section, ExperimentContent } from "../types";
import Navbar from "../components/Navbar";
import Editor from "../components/Editor";
import QuizEditor from "../components/QuizEditor";
import Preview from "../components/Preview";
import axios from "axios";

interface EditorPageProps {
  theme: Theme;
  prompt: string;
  setPrompt: (prompt: string) => void;
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  isPreviewMode: boolean;
  setIsPreviewMode: (mode: boolean) => void;
  experimentId: string;
  content: ExperimentContent;
  quizVersion: number;
  handleGenerate: (text: string) => void;
  handleContentChange: (experimentId: string, section: Section, newContent: string | ExperimentContent["quiz"]) => void;
  isLoading: boolean;
}

const sections = [
  { id: "aim" as Section, icon: Lightbulb, label: "Aim" },
  { id: "introduction" as Section, icon: BookOpen, label: "Introduction" },
  { id: "article" as Section, icon: FileText, label: "Article" },
  { id: "illustration" as Section, icon: Image, label: "Illustration" },
  { id: "quiz" as Section, icon: HelpCircle, label: "Quiz" },
];

const EditorPage: React.FC<EditorPageProps> = ({
  theme,
  prompt,
  setPrompt,
  activeSection,
  setActiveSection,
  isPreviewMode,
  setIsPreviewMode,
  experimentId,
  content,
  quizVersion,
  handleGenerate,
  handleContentChange,
  isLoading,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "uploaded" | "error">("idle");
  const [extractedText, setExtractedText] = useState<string>("");

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setUploadStatus("uploading");
    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const response = await axios.post("https://ves-t89l.onrender.com/extract-text", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setExtractedText(response.data.text);
      setUploadStatus("uploaded");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("error");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && /\.(pptx|pdf|docx|doc)$/i.test(droppedFile.name)) {
      handleFileUpload(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && /\.(pptx|pdf|docx|doc)$/i.test(selectedFile.name)) {
      handleFileUpload(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadStatus("idle");
    setExtractedText("");
  };

  const onGenerateClick = () => {
    const textToGenerate = file ? extractedText : prompt;
    if (textToGenerate.trim()) {
      handleGenerate(textToGenerate);
    }
  };

  return (
    <>
      {!isPreviewMode ? (
        <>
          <div className="mb-8">
            <div
              className={`rounded-lg shadow-lg p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {!file ? (
                <>
                  <label
                    className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Enter your prompt or upload a document
                  </label>
                  <textarea
                    className={`w-full h-32 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                        : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
                    }`}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your experiment here..."
                  />
                  <div className="mt-4 flex items-center gap-4">
                    <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                      <Upload size={20} />
                      Upload File
                      <input
                        type="file"
                        accept=".pptx,.pdf,.docx,.doc"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                    </label>
                    <p
                      className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                    >
                      or drag and drop here (PPTX, PDF, DOCX, DOC)
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between p-4 bg-gray-100 rounded-md">
                  <div className="flex items-center gap-2">
                    <Upload size={20} className={uploadStatus === "error" ? "text-red-500" : "text-blue-500"} />
                    <span>
                      {uploadStatus === "uploading"
                        ? "Uploading..."
                        : uploadStatus === "uploaded"
                        ? `Uploaded: ${file.name}`
                        : "Upload failed"}
                    </span>
                  </div>
                  <button
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Remove File"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
              <button
                onClick={onGenerateClick}
                disabled={isLoading || (!prompt.trim() && !file)}
                className={`mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors ${
                  isLoading || (!prompt.trim() && !file) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Generating..." : "Generate Content"}
              </button>
            </div>
          </div>
          <Navbar sections={sections} activeSection={activeSection} onSectionChange={setActiveSection} theme={theme} />
          <div className="mt-6">
            {activeSection === "quiz" ? (
              <QuizEditor
                quiz={content.quiz}
                onChange={(expId, newQuiz) => handleContentChange(expId, "quiz", newQuiz)}
                theme={theme}
                experimentId={experimentId}
                quizVersion={quizVersion}
              />
            ) : activeSection === "illustration" ? (
              <div
                className={`rounded-lg shadow-lg p-6 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
              >
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Image size={24} />
                  Illustration
                </h2>
                {content.illustration === "Generating video..." ? (
                  <div className="text-center text-lg">
                    <p>Generating video...</p>
                  </div>
                ) : content.illustration ? (
                  <video
                    controls
                    src={content.illustration}
                    className="w-full max-w-2xl mx-auto rounded-md"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    No video available. Generate content to see a video here.
                  </p>
                )}
              </div>
            ) : (
              <Editor
                content={content[activeSection]}
                onChange={(newContent) => handleContentChange(experimentId, activeSection, newContent)}
                theme={theme}
              />
            )}
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={() => setIsPreviewMode(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              <Play size={20} />
              Preview
            </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              <Save size={20} />
              Save
            </button>
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => setIsPreviewMode(false)}
            className={`mb-6 px-6 py-2 rounded-md transition-colors ${
              theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            Back to Editor
          </button>
          <Preview content={content} theme={theme} />
        </>
      )}
    </>
  );
};

export default EditorPage;