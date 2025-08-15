// src/components/MainNavbar.tsx
import React from "react";
import { Sun, Moon, Bell } from "lucide-react";
import { Theme, Page } from "../types";

interface MainNavbarProps {
  theme: Theme;
  toggleTheme: () => void;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  toggleNotifications: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const MainNavbar: React.FC<MainNavbarProps> = ({
  theme,
  toggleTheme,
  currentPage,
  setCurrentPage,
  toggleNotifications,
  isLoggedIn,
  onLogout,
}) => (
  <nav className={`p-4 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"} shadow-md`}>
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-xl font-bold">Virtual Experiment Sandbox</h1>
      <div className="flex items-center gap-6">
        <button onClick={() => setCurrentPage("home")} className={currentPage === "home" ? "font-bold" : ""}>
          Home
        </button>
        {isLoggedIn ? (
          <>
            <button onClick={() => setCurrentPage("experiments")} className={currentPage === "experiments" ? "font-bold" : ""}>
              Experiments
            </button>
            <button onClick={() => setCurrentPage("roadmap")} className={currentPage === "roadmap" ? "font-bold" : ""}>
              Roadmap
            </button>
            <button onClick={onLogout} className="text-red-500 hover:text-red-700">Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => setCurrentPage("login")} className={currentPage === "login" ? "font-bold" : ""}>
              Login
            </button>
            <button onClick={() => setCurrentPage("signup")} className={currentPage === "signup" ? "font-bold" : ""}>
              Signup
            </button>
          </>
        )}
        <button onClick={toggleNotifications}>
          <Bell size={20} />
        </button>
        <button onClick={toggleTheme}>{theme === "light" ? <Moon size={20} /> : <Sun size={20} />}</button>
      </div>
    </div>
  </nav>
);

export default MainNavbar;