import React from "react";

export default function Loading({ message = "Loading galaxy..." }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 text-white flex-col gap-4"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(10, 10, 30, 0.95) 0%, rgba(0, 0, 0, 0.98) 60%)",
      }}
      role="status"
      aria-live="polite"
    >
      <div
        className="w-56 h-56 rounded-full bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/textures/8k_stars_milky_way.jpg')",
          boxShadow:
            "0 0 40px rgba(0, 200, 255, 0.08), inset 0 0 60px rgba(255, 200, 50, 0.06)",
          animation: "rotateGalaxy 18s linear infinite",
          filter: "saturate(1.1) contrast(1.05)",
        }}
      >
        <div
          className="w-16 h-16 rounded-full border-2"
          style={{
            borderColor: "rgba(255, 255, 255, 0.08)",
            borderTopColor: "#ffcc33",
            animation: "spin 1s linear infinite",
            boxShadow: "0 0 14px rgba(255, 200, 50, 0.25)",
          }}
        />
      </div>
      <div className="font-sans text-sm text-white/90 text-center">
        {message}
      </div>
    </div>
  );
}
