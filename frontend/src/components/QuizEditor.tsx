// src/components/QuizEditor.tsx
import React, { useState, useEffect } from "react";
import { Theme, QuizData, QuizQuestion } from "../types";
import { HelpCircle, List, CheckCircle, PlusCircle, Trash2 } from "lucide-react";

interface QuizEditorProps {
  quiz: QuizData | undefined;
  onChange: (experimentId: string, newQuiz: QuizData) => void;
  theme: Theme;
  experimentId: string;
  quizVersion: number; // New prop to track generation version
}

const QuizEditor: React.FC<QuizEditorProps> = ({ quiz, onChange, theme, experimentId, quizVersion }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(quiz?.questions || []);

  // Sync with quiz prop only when quizVersion changes (indicating fresh generation)
  useEffect(() => {
    setQuestions(quiz?.questions || []);
  }, [quizVersion]); // Depend on quizVersion, not quiz

  const handleQuestionChange = (id: number, field: keyof QuizQuestion, value: string | string[]) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, [field]: value } : q
    );
    setQuestions(updatedQuestions);
    onChange(experimentId, { totalQuestions: updatedQuestions.length, questions: updatedQuestions });
  };

  const addQuestion = () => {
    const safeQuestions = questions || [];
    const newId = safeQuestions.length ? Math.max(...safeQuestions.map((q) => q.id)) + 1 : 1;
    const newQuestion: QuizQuestion = {
      id: newId,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      difficulty: "EASY",
    };
    const updatedQuestions = [...safeQuestions, newQuestion];
    setQuestions(updatedQuestions);
    onChange(experimentId, { totalQuestions: updatedQuestions.length, questions: updatedQuestions });
  };

  const removeQuestion = (id: number) => {
    const updatedQuestions = (questions || []).filter((q) => q.id !== id);
    setQuestions(updatedQuestions);
    onChange(experimentId, { totalQuestions: updatedQuestions.length, questions: updatedQuestions });
  };

  return (
    <div
      className={`rounded-lg shadow-lg p-6 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
    >
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <HelpCircle size={24} />
        Quiz Editor
      </h2>
      {(questions || []).length === 0 ? (
        <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          No questions yet. Generate content or add a question below.
        </p>
      ) : (
        questions.map((q, index) => (
          <div
            key={q.id}
            className={`mb-8 p-5 rounded-lg border ${theme === "dark" ? "border-gray-700 bg-gray-700" : "border-gray-200 bg-gray-50"}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <HelpCircle size={20} className="text-blue-500" />
                Question {index + 1}
              </h3>
              <button
                onClick={() => removeQuestion(q.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Delete Question"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1">
                  <HelpCircle size={16} className="text-blue-500" />
                  Question
                </label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(q.id, "question", e.target.value)}
                  placeholder="Enter your question"
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark" ? "bg-gray-600 text-white border-gray-500" : "bg-white text-gray-900 border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <List size={16} className="text-blue-500" />
                  Options
                </label>
                {q.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <span className="w-8 text-center">{String.fromCharCode(65 + idx)}.</span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...q.options];
                        newOptions[idx] = e.target.value;
                        handleQuestionChange(q.id, "options", newOptions);
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      className={`flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === "dark" ? "bg-gray-600 text-white border-gray-500" : "bg-white text-gray-900 border-gray-300"
                      }`}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1">
                  <CheckCircle size={16} className="text-green-500" />
                  Correct Answer
                </label>
                <input
                  type="text"
                  value={q.correctAnswer}
                  onChange={(e) => handleQuestionChange(q.id, "correctAnswer", e.target.value)}
                  placeholder="Enter the correct answer"
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    theme === "dark" ? "bg-gray-600 text-white border-gray-500" : "bg-white text-gray-900 border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-1">
                  <List size={16} className="text-blue-500" />
                  Difficulty
                </label>
                <select
                  value={q.difficulty}
                  onChange={(e) =>
                    handleQuestionChange(q.id, "difficulty", e.target.value as "EASY" | "MEDIUM" | "HARD")
                  }
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark" ? "bg-gray-600 text-white border-gray-500" : "bg-white text-gray-900 border-gray-300"
                  }`}
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>
          </div>
        ))
      )}
      <button
        onClick={addQuestion}
        className={`mt-6 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors`}
      >
        <PlusCircle size={20} />
        Add New Question
      </button>
    </div>
  );
};

export default QuizEditor;