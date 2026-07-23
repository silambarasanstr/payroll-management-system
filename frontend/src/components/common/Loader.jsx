import React from "react";

export default function Loader({
  text = "Loading...",
  height = "70vh",
  size = "h-8 w-8",
}) {
  return (
    <div
      className="flex items-center justify-center"
      style={{ height }}
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className={`${size} animate-spin rounded-full border-4 border-emerald-600 border-t-transparent`}
        ></div>

        <p className="text-sm font-medium text-slate-500 font-sans">
          {text}
        </p>
      </div>
    </div>
  );
}