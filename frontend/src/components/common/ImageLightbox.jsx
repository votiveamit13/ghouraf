import { useEffect, useCallback } from "react";

export default function ImageLightbox({ images = [], index, onClose, onChange }) {
  const isOpen = index !== null && index !== undefined;

  const prev = useCallback(
    () => onChange((index - 1 + images.length) % images.length),
    [index, images.length, onChange]
  );
  const next = useCallback(
    () => onChange((index + 1) % images.length),
    [index, images.length, onChange]
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose, prev, next]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 text-white text-4xl leading-none w-10 h-10"
      >
        &times;
      </button>

      {images.length > 1 && (
        <button
          type="button"
          aria-label="Previous"
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-4 text-white text-3xl w-10 h-10 rounded-full bg-white/20 hover:bg-white/30"
        >
          &#8249;
        </button>
      )}

      <img
        src={images[index]}
        alt={`Image ${index + 1}`}
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-full object-contain rounded"
      />

      {images.length > 1 && (
        <button
          type="button"
          aria-label="Next"
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-4 text-white text-3xl w-10 h-10 rounded-full bg-white/20 hover:bg-white/30"
        >
          &#8250;
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-4 text-white text-sm">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}