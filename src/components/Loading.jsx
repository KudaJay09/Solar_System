import React from "react";

export default function Loading({ message = "Loading galaxy..." }) {
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-galaxy">
        <div className="loading-spinner" />
      </div>
      <div className="loading-text">{message}</div>
    </div>
  );
}
