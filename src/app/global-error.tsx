"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          background: "#fff",
          color: "#111",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ fontSize: "3rem", margin: "0 0 1rem" }}>🍳</p>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 0.5rem" }}>
            Something went wrong
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: "0 0 1.5rem" }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#c2501f",
              color: "#fff",
              border: "none",
              borderRadius: "9999px",
              padding: "0.625rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
