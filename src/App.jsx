import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes.jsx";
import { THEME_KEY } from "./utils/constants";

export default function App() {
  useEffect(() => {
    if (typeof document !== "undefined" && typeof localStorage !== "undefined") {
      try {
        document.documentElement.classList.toggle("dark", localStorage.getItem(THEME_KEY) === "dark");
      } catch (error) {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  return (
    <>
      <div className="sr-only" data-testid="app-loaded">
        APP LOADED
      </div>
      <AppRoutes />
    </>
  );
}