export default function ErrorAlert({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100">
      {message}
    </div>
  );
}
