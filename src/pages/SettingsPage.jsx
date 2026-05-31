import { useEffect, useState } from "react";
import { THEME_KEY } from "../utils/constants";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(THEME_KEY) === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Settings</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Personalize the portal while backend settings are being prepared.</p>
      </div>
      <section className="panel divide-y divide-slate-200 dark:divide-slate-800">
        <div className="flex items-center justify-between gap-4 p-5">
          <div>
            <h3 className="font-semibold text-slate-950 dark:text-white">Dark mode</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Switch between light and dark UI.</p>
          </div>
          <button
            type="button"
            onClick={() => setDarkMode((value) => !value)}
            className={`relative h-7 w-12 rounded-full transition ${darkMode ? "bg-sky-600" : "bg-slate-300"}`}
            aria-pressed={darkMode}
          >
            <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${darkMode ? "left-6" : "left-1"}`} />
          </button>
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-slate-950 dark:text-white">API Mode</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Mock data is active. The Axios client is ready for http://localhost:8080/api.</p>
        </div>
      </section>
    </div>
  );
}
