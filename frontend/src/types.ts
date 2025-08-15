// src/types.ts
import { Position } from "reactflow";

export type Section = "aim" | "introduction" | "article" | "illustration" | "quiz";
export type Theme = "light" | "dark";
export type Page = "home" | "experiments" | "roadmap" | "editor" | "login" | "signup";

export interface ExperimentContent {
  aim: string;
  introduction: string;
  article: string;
  illustration: string;
  quiz: QuizData; // Updated from string to QuizData
}

export interface QuizData {
  totalQuestions: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface Experiment {
  id: string;
  title: string;
  content: ExperimentContent;
}

export interface RoadmapNode {
  id: string;
  data: { label: string; description: string; details?: string; subsections?: any[] };
  position: { x: number; y: number };
  type?: string;
  sourcePosition?: Position;
  targetPosition?: Position;
}

export interface User {
  username: string;
  password: string;
}