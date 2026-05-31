import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ErrorAlert from "../components/ErrorAlert";
import { useAuth } from "../hooks/useAuth";
import { validateRegister } from "../utils/validators";

export default function RegisterPage() {
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateRegister(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setMessage("");
    try {
      await register(values);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setMessage(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Create account</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Start with a user role account in mock mode.</p>
        <div className="mt-5">
          <ErrorAlert message={message} />
        </div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="field-label" htmlFor="name">Name</label>
            <input id="name" className="field-input" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
          </div>
          <div>
            <label className="field-label" htmlFor="email">Email</label>
            <input id="email" type="email" className="field-input" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} />
            {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
          </div>
          <div>
            <label className="field-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="field-input" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} />
            {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Creating..." : "Register"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Already registered? <Link to="/login" className="font-semibold text-sky-700 dark:text-sky-300">Login</Link>
        </p>
      </section>
    </main>
  );
}
