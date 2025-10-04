"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="grid h-10 min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
      <h1 className="text-2xl font-bold">Something went wrong!</h1>
      <p className="text-red-500">{error.message}</p>
      <button onClick={reset} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        Try again
      </button>
    </div>
  );
}
