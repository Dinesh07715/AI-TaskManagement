import { useState } from "react";
import { Link } from "react-router-dom";
import ErrorAlert from "../components/ErrorAlert";
import { aiService } from "../services/aiService";

export default function AIAssistantPage() {
  const [title, setTitle] = useState("Prepare Client Presentation");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(event) {
    event.preventDefault();
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const suggestion = await aiService.generateTaskDetails(title);
      setResult(suggestion);
    } catch (err) {
      setError(err.message || "Unable to generate details");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white">AI Assistant</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Generate task details from a title using mock AI responses.</p>
      </div>

      <form onSubmit={handleGenerate} className="panel grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <label className="field-label" htmlFor="taskTitle">Task Title</label>
          <input id="taskTitle" className="field-input" value={title} onChange={(event) => setTitle(event.target.value)} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary h-10">
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      <ErrorAlert message={error} />

      {result && (
        <section className="panel p-5">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Suggested Task Details</h3>
          <dl className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Description</dt>
              <dd className="mt-2 text-sm text-slate-800 dark:text-slate-100">{result.description}</dd>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Priority</dt>
              <dd className="mt-2 text-sm font-bold text-rose-700 dark:text-rose-300">{result.priority}</dd>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Estimated Time</dt>
              <dd className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{result.estimatedTime}</dd>
            </div>
          </dl>
          <div className="mt-5 flex justify-end">
            <Link
              to="/tasks/new"
              state={{ title, description: result.description, priority: result.priority }}
              className="btn-secondary"
            >
              Create task from result
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
