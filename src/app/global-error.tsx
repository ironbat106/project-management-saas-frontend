"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          maxWidth: 520,
          margin: "0 auto",
          padding: "96px 16px",
        }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 12 }}>Something went wrong</h1>
        <p style={{ color: "#555", marginBottom: 24 }}>
          The app hit an unexpected problem. Try again, or reload the page.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            background: "#0f6b6b",
            color: "#fff",
            border: 0,
            borderRadius: 8,
            padding: "10px 18px",
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
