import React from "react";

export default function Loader({ fullScreen = false }) {
  const loader = (
    <div className="flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-purple-500 border-dashed rounded-full animate-spin"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
        {loader}
      </div>
    );
  }

  return loader;
}
