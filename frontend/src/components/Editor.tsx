// src/components/Editor.tsx
import React from "react";
import { Theme } from "../types";
import ReactMarkdown from "react-markdown";

interface EditorProps {
  content: string;
  onChange: (newContent: string) => void;
  theme: Theme;
}

const Editor: React.FC<EditorProps> = ({ content, onChange, theme }) => (
  <div className={`rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
    <div className="flex">
      <textarea
        className={`flex-1 p-4 h-96 border-r ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your content here..."
      />
      <div className={`flex-1 p-4 prose ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"}`}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  </div>
);

export default Editor;