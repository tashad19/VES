// src/components/Preview.tsx
import React from "react";
import { Theme, ExperimentContent } from "../types";
import ReactMarkdown from "react-markdown";

interface PreviewProps {
  content: ExperimentContent;
  theme: Theme;
}

const Preview: React.FC<PreviewProps> = ({ content, theme }) => (
  <div className={`p-8 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
    <h1 className="text-3xl font-bold mb-6">Preview</h1>
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Aim</h2>
      <ReactMarkdown>{content.aim}</ReactMarkdown>
    </section>
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
      <ReactMarkdown>{content.introduction}</ReactMarkdown>
    </section>
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Article</h2>
      <ReactMarkdown>{content.article}</ReactMarkdown>
    </section>
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Illustration</h2>
      <ReactMarkdown>{content.illustration}</ReactMarkdown>
    </section>
    <section>
      <h2 className="text-2xl font-semibold mb-4">Quiz</h2>
      {content.quiz.totalQuestions === 0 ? (
        <p>No quiz questions available.</p>
      ) : (
        <ul className="space-y-4">
          {content.quiz.questions.map((q) => (
            <li key={q.id} className="p-4 border rounded-md">
              <p className="font-semibold">{q.question}</p>
              <ul className="list-disc pl-5 mt-2">
                {q.options.map((opt, idx) => (
                  <li key={idx} className={opt === q.correctAnswer ? "text-green-500" : ""}>
                    {opt} {opt === q.correctAnswer ? "(Correct)" : ""}
                  </li>
                ))}
              </ul>
              <p className="text-sm mt-2">Difficulty: {q.difficulty}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  </div>
);

export default Preview;