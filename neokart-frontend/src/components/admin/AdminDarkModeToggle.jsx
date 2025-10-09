// 📁 src/components/DarkModeToggle.jsx
import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`relative w-16 h-8 flex items-center rounded-full p-1 transition-all duration-300 focus:outline-none ${
        theme === "dark" ? "bg-gray-700" : "bg-yellow-400"
      }`}
    >
      {/* Slider circle */}
      <div
        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          theme === "dark" ? "translate-x-8" : "translate-x-0"
        } flex items-center justify-center`}
      >
        {theme === "dark" ? (
          <Moon className="w-4 h-4 text-gray-800" />
        ) : (
          <Sun className="w-4 h-4 text-yellow-400" />
        )}
      </div>
    </button>
  );
}
